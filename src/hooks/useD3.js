// NPM Packages
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function useD3(renderD3, dependencies) {
  // Hooks
  const ref = useRef();

  useEffect(() => {
    renderD3(d3.select(ref.current));

    return () => {};
  }, dependencies);

  return ref;
}

export default useD3;
