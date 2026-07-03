import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UploadResponse {
  public_id: string;
  secure_url: string;
  original_filename?: string;
  bytes?: number;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
}

async function uploadToCloudinary(
  file: ArrayBuffer,
  filename: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  folder: string = "nutrition-teagan"
): Promise<UploadResponse> {
  const timestamp = Math.round(Date.now() / 1000);
  const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

  // Generate SHA-1 signature
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Build multipart form data
  const boundary = '----FormBoundary' + Date.now();
  const formData: Uint8Array[] = [];

  const addField = (name: string, value: string) => {
    const str = `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`;
    formData.push(encoder.encode(str));
  };

  addField('api_key', apiKey);
  addField('timestamp', timestamp.toString());
  addField('signature', signature);
  addField('folder', folder);

  // Add file
  const fileContent = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/octet-stream\r\n\r\n`;
  formData.push(encoder.encode(fileContent));
  formData.push(new Uint8Array(file));
  formData.push(encoder.encode('\r\n'));
  formData.push(encoder.encode(`--${boundary}--\r\n`));

  const body = new Uint8Array(formData.reduce<number[]>((acc, arr) => [...acc, ...arr], []));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  return response.json();
}

async function deleteFromCloudinary(
  publicId: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string
): Promise<void> {
  const timestamp = Math.round(Date.now() / 1000);
  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const signature = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const formData = new URLSearchParams();
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('public_id', publicId);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary delete failed: ${error}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Get Cloudinary credentials from environment
  const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
  const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
  const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

  if (!cloudName || !apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({ error: 'Cloudinary credentials not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (req.method === 'POST' && action === 'upload') {
      const formData = await req.formData();
      const file = formData.get('file');
      const folder = formData.get('folder') as string || 'nutrition-teagan';

      if (!file || !(file instanceof File)) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Upload to Cloudinary
      const result = await uploadToCloudinary(
        arrayBuffer,
        file.name,
        cloudName,
        apiKey,
        apiSecret,
        folder
      );

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            public_id: result.public_id,
            secure_url: result.secure_url,
            original_filename: result.original_filename,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method === 'DELETE' && action === 'delete') {
      const body = await req.json();
      const { publicId } = body;

      if (!publicId) {
        return new Response(
          JSON.stringify({ error: 'No public_id provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      await deleteFromCloudinary(publicId, cloudName, apiKey, apiSecret);

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Cloudinary function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
