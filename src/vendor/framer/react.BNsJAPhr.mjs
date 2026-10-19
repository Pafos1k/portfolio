/* ABI adapter: generated Framer components share the application's React renderer.
   Export names match the original bundle; there is no second embedded React copy. */
import * as React from 'react';
import {jsx as reactJsx, jsxs as reactJsxs} from 'react/jsx-runtime';
import {createPortal} from 'react-dom';
import {createRoot, hydrateRoot} from 'react-dom/client';
// Framer-only metadata belongs on component frames, not native DOM elements.
const frameOnlyProps = new Set(['__withFX','rendersWithMotion','duplicatedFrom','layoutId','parentSize','providedWindow','onFgRJFvd95Change']);
function domProps(type, props) {
 if(typeof type !== 'string' || !props) return props;
 return Object.fromEntries(Object.entries(props).filter(([key]) => !frameOnlyProps.has(key)));
}
const createElement = (type, props, ...children) => React.createElement(type, domProps(type, props), ...children);
const jsx = (type, props, key) => reactJsx(type, domProps(type, props), key);
const jsxs = (type, props, key) => reactJsxs(type, domProps(type, props), key);
const cloneElement = (element, props, ...children) => {
 if(typeof element.type !== 'string') return React.cloneElement(element, props, ...children);
 const next={...element.props,...props,key:props?.key ?? element.key,ref:props?.ref ?? element.ref};
 return React.createElement(element.type,domProps(element.type,next),...(children.length?children:[next.children]));
};
const ReactRuntime = {...React, createElement, cloneElement};
const ReactNamespace = {...ReactRuntime, default: ReactRuntime};
const initialize = () => {};
const browserWindow = typeof window === 'undefined' ? undefined : window;
const browserNavigator = typeof navigator === 'undefined' ? undefined : navigator;
export {
 ReactNamespace as D, ReactRuntime as S,
 initialize as R, initialize as T, initialize as o, initialize as a, initialize as n,
 browserWindow as B, browserNavigator as z,
 jsx as c, jsxs as l, createElement as u, cloneElement as A,
 createPortal as i, createRoot as r, hydrateRoot as t,
};
export {
 useLayoutEffect as C, Children as E, Fragment as F,
 useState as I, createContext as L, useMemo as M, useCallback as N,
 useDeferredValue as O, useEffect as P, forwardRef as _, useId as b,
 Component as d, isValidElement as f, memo as g, createRef as h,
 useContext as j, useRef as k, Suspense as m, lazy as p, Fragment as s,
 startTransition as v, useInsertionEffect as w,
 useSyncExternalStore as x, useTransition as y,
} from 'react';
