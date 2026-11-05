// Caps the devicePixelRatio the page reads, for canvas libraries that offer no pixel-ratio option of their own.

const PROPERTY = 'devicePixelRatio';

// Finds the property where it is defined: on window itself in browsers, or further up the prototype chain.
function findRatioDescriptor(target: object): PropertyDescriptor | undefined {
  let owner: unknown = target;
  while (typeof owner === 'object' && owner !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(owner, PROPERTY);
    if (descriptor !== undefined) {
      return descriptor;
    }
    owner = Object.getPrototypeOf(owner);
  }
  return undefined;
}

// Makes devicePixelRatio read at most the maximum (still following browser zoom) and returns a restore function.
export function clampDevicePixelRatio(maxRatio: number, target: object = window): () => void {
  const ownDescriptor = Object.getOwnPropertyDescriptor(target, PROPERTY);
  const descriptor = findRatioDescriptor(target);
  const fixedRatio = Number(descriptor?.value ?? 1);
  const readNativeRatio = () =>
    descriptor?.get === undefined ? fixedRatio : Number(descriptor.get.call(target));
  Object.defineProperty(target, PROPERTY, {
    configurable: true,
    enumerable: true,
    get: () => Math.min(readNativeRatio(), maxRatio),
  });
  return () => {
    if (ownDescriptor === undefined) {
      Reflect.deleteProperty(target, PROPERTY);
      return;
    }
    Object.defineProperty(target, PROPERTY, ownDescriptor);
  };
}
