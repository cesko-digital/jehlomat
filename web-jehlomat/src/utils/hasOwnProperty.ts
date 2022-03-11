export default <X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> => 
  Object.hasOwnProperty.call(obj, prop);