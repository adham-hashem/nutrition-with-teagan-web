import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  navigate: () => {},
});


export function Router({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, '', to);
    setPathname(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function usePathname() {
  return useContext(RouterContext).pathname;
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

export function Link({ to, children, className, onClick, target, rel, 'aria-label': ariaLabel }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === '_blank') return;
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

interface RouteProps {
  path: string;
  element: ReactNode;
}

interface RoutesProps {
  children: ReactNode;
}

function matchPath(pathPattern: string, pathname: string): boolean {
  const patternParts = pathPattern.split('/');
  const pathParts = pathname.split('/');

  if (patternParts.length !== pathParts.length) {
    return false;
  }

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      continue;
    }

    if (patternPart !== pathPart) {
      return false;
    }
  }

  return true;
}

export function Routes({ children }: RoutesProps) {
  const { pathname } = useRouter();
  const routes = Array.isArray(children) ? children : [children];

  for (const route of routes as React.ReactElement<RouteProps>[]) {
    if (route?.props?.path && matchPath(route.props.path, pathname)) {
      return <>{route.props.element}</>;
    }
  }

  // Default to home if no match
  return <>{(routes as React.ReactElement<RouteProps>[])[0]?.props?.element}</>;
}

export function Route(_props: RouteProps) {
  return null;
}
