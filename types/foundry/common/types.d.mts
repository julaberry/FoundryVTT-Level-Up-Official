export * from "./documents/_types.d.mts";
export type DocumentConstructionContext = {
  /**
   * The parent Document of this one, if this one is embedded
   */
  parent?: Document | null;
  /**
   * The compendium collection ID which contains this Document, if any
   */
  pack?: string | null;
  /**
   * Whether to validate initial data strictly?
   */
  strict?: boolean;
};
/**
 * Make all properties in T recursively readonly.
 */
/**
 * A class constructor.
 * Used for functions with generic class constructor parameters.
 */
export type Constructor = new (...args: any[]) => any;
/**
 * A single point, expressed as an object {x, y}
 */
export type Point = PIXI.Point | {
  x: number;
  y: number;
};
/**
 * A single point, expressed as an array [x,y]
 */
export type PointArray = number[];
/**
 * A standard rectangle interface.
 */
export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type BuiltinTypes = typeof Number | typeof String | typeof Boolean;
export type ColorSource = number | [red: number, green: number, blue: number] | string | Color;
/**
 * A Client Setting
 */
export type SettingConfig = {
  /**
   * A unique machine-readable id for the setting
   */
  key: string;
  /**
   * The namespace the setting belongs to
   */
  namespace: string;
  /**
   * The human-readable name
   */
  name: string;
  /**
   * An additional human-readable hint
   */
  hint: string;
  /**
   * The scope the Setting is stored in, either World or Client
   */
  scope: string;
  /**
   * Indicates if this Setting should render in the Config application
   */
  config: boolean;
  /**
   * The type of data stored by this Setting
   */
  type: BuiltinTypes | DataField | DataModel;
  /**
   * For string Types, defines the allowable values
   */
  choices?: any;
  /**
   * For numeric Types, defines the allowable range
   */
  range?: any;
  /**
   * The default value
   */
  default?: any;
  /**
   * Executes when the value of this Setting changes
   */
  onChange?: Function;
  /**
   * A custom form field input used in conjunction with a DataField type
   */
  input?: CustomFormInput;
};
/**
 * A Client Setting Submenu
 */
export type SettingSubmenuConfig = {
  /**
   * The human readable name
   */
  name: string;
  /**
   * The human readable label
   */
  label: string;
  /**
   * An additional human readable hint
   */
  hint: string;
  /**
   * The classname of an Icon to render
   */
  icon: string;
  /**
   * The FormApplication class to render TODO better typing
   */
  type: any;
  /**
   * If true, only a GM can edit this Setting
   */
  restricted: boolean;
};
/**
 * A Client Keybinding Action Configuration
 */
export type KeybindingActionConfig = {
  /**
   * The namespace within which the action was registered
   */
  namespace?: string;
  /**
   * The human-readable name
   */
  name: string;
  /**
   * An additional human-readable hint
   */
  hint?: string;
  /**
   * The default bindings that can never be changed nor removed.
   */
  uneditable?: KeybindingActionBinding[];
  /**
   * The default bindings that can be changed by the user.
   */
  editable?: KeybindingActionBinding[];
  /**
   * A function to execute when a key down event occurs. If True is returned, the event is consumed and no further keybinds execute.
   */
  onDown?: Function;
  /**
   * A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute.
   */
  onUp?: Function;
  /**
   * If True, allows Repeat events to execute the Action's onDown. Defaults to false.
   */
  repeat?: boolean;
  /**
   * If true, only a GM can edit and execute this Action
   */
  restricted?: boolean;
  /**
   * Modifiers such as [ "CONTROL" ] that can be also pressed when executing this Action. Prevents using one of these modifiers as a Binding.
   */
  reservedModifiers?: string[];
  /**
   * The preferred precedence of running this Keybinding Action
   */
  precedence?: number;
  /**
   * The recorded registration order of the action
   */
  order?: number;
};
/**
 * A Client Keybinding Action Binding
 */
export type KeybindingActionBinding = {
  /**
   * A numeric index which tracks this bindings position during form rendering
   */
  index?: number;
  /**
   * The KeyboardEvent#code value from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
   */
  key: string;
  /**
   * An array of modifiers keys from KeyboardManager.MODIFIER_KEYS which are required for this binding to be activated
   */
  modifiers?: string[];
};
/**
 * An action that can occur when a key is pressed
 */
export type KeybindingAction = {
  /**
   * The namespaced machine identifier of the Action
   */
  action: string;
  /**
   * The Keyboard key
   */
  key: string;
  /**
   * The human-readable name
   */
  name: string;
  /**
   * Required modifiers
   */
  requiredModifiers: string[];
  /**
   * Optional (reserved) modifiers
   */
  optionalModifiers: string[];
  /**
   * The handler that executes onDown
   */
  onDown: Function;
  /**
   * The handler that executes onUp
   */
  onUp: Function;
  /**
   * If True, allows Repeat events to execute this Action's onDown
   */
  repeat: boolean;
  /**
   * If true, only a GM can execute this Action
   */
  restricted: boolean;
  /**
   * The registration precedence
   */
  precedence: number;
  /**
   * The registration order
   */
  order: number;
};
/**
 * Keyboard event context
 */
export type KeyboardEventContext = {
  /**
   * The normalized string key, such as "A"
   */
  key: string;
  /**
   * The originating keypress event
   */
  event: KeyboardEvent;
  /**
   * Is the Shift modifier being pressed
   */
  isShift: boolean;
  /**
   * Is the Control or Meta modifier being processed
   */
  isControl: boolean;
  /**
   * Is the Alt modifier being pressed
   */
  isAlt: boolean;
  /**
   * Are any of the modifiers being pressed
   */
  hasModifier: boolean;
  /**
   * A list of string modifiers applied to this context, such as [ "CONTROL" ]
   */
  modifiers: string[];
  /**
   * True if the Key is Up, else False if down
   */
  up: boolean;
  /**
   * True if the given key is being held down such that it is automatically repeating.
   */
  repeat: boolean;
  /**
   * The executing Keybinding Action. May be undefined until the action is known.
   */
  action?: string;
};
/**
 * Connected Gamepad info
 */
export type ConnectedGamepad = {
  /**
   * A map of axes values
   */
  axes: Map<string, number>;
  /**
   * The Set of pressed Buttons
   */
  activeButtons: Set<string>;
};
export type RequestData = object | object[] | string | string[];
export type SocketRequest = {
  options?: object;
  broadcast?: boolean;
};
export type SocketResponse = {
  /**
   * The initial request
   */
  request: SocketRequest;
  /**
   * An error, if one occurred
   */
  error?: Error;
  /**
   * The status of the request
   */
  status?: string;
  /**
   * The ID of the requesting User
   */
  userId?: string;
  /**
   * Data returned as a result of the request
   */
  data?: RequestData;
};