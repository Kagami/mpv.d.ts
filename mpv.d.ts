// Types for mpv JavaScript API (MuJS runtime). Reference:
// https://github.com/mpv-player/mpv/blob/master/DOCS/man/javascript.rst
// https://github.com/mpv-player/mpv/blob/master/DOCS/man/input.rst
// https://github.com/mpv-player/mpv/blob/master/DOCS/man/lua.rst

declare global {
  // Global API methods.
  var mp: {
    get_property(name: string): string | undefined;
    get_property(name: string, def: string): string;

    command(command: string): true | undefined;
    commandv(...args: string[]): true | undefined;
    command_native(table: MP.CommandArgs): unknown;
    command_native_async(table: MP.CommandArgs, fn?: (success: boolean, result: unknown, error: string) => void): number;

    last_error(): string;

    msg: {
      log(level: MP.LogLevel, ...msg: unknown[]): void;
      fatal(...msg: unknown[]): void;
      error(...msg: unknown[]): void;
      warn(...msg: unknown[]): void;
      info(...msg: unknown[]): void;
      verbose(...msg: unknown[]): void;
      debug(...msg: unknown[]): void;
      trace(...msg: unknown[]): void;
    };

    utils: {
      get_user_path(path: string): string;
      split_path(path: string): [string, string];
      join_path(p1: string, p2: string): string;
    };

    // TODO(Kagami): remove
    [key: string]: any;
  };

  // MuJS doesn't have DOM API but implements few functions such as setTimeout.
  // https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts
  function setInterval(handler: string | Function, timeout?: number, ...arguments: any[]): number;
  function setTimeout(handler: string | Function, timeout?: number, ...arguments: any[]): number;
}

// Auxiliary types are kept in separate namespace to not be confused with official API.
export namespace MP {
  type MP = typeof mp;

  type NodeArray = Native[];
  type NodeMap = { [key: string]: Native };
  type Native = undefined | null | boolean | number | string | NodeArray | NodeMap;

  type LogLevel = "fatal" | "error" | "warn" | "info" | "v" | "debug" | "trace";
  type Platform = "windows" | "darwin" | "linux" | "android" | "freebsd" | string;

  type CommandArgs = NodeArray | (NodeMap & { name: string });
  type SubprocessArgs = {
    name: "subprocess";
    args: string[];
    playback_only?: boolean;
    capture_size?: number;
    capture_stdout?: boolean;
    capture_stderr?: boolean;
    detach?: boolean;
    env?: string[];
    stdin_data?: string;
    passthrough_stdin?: boolean;
  };
  interface SubprocessResult {
    status: number;
    stdout: string;
    stderr: string;
    error_string: string;
    killed_by_us: boolean;
  }

  interface Track {
    id: number;
    type: "video" | "audio" | "sub";
    selected: boolean;
    external: boolean;
    "external-filename": string;
  }

  interface Filter {
    name: string;
    label?: string;
    enabled?: boolean;
    params?: { [key: string]: string };
  }

  interface Encoder {
    codec: string;
    driver: string;
    description: string;
  }
}

// TODO(Kagami): Review and incorporate.
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/mpv-script/index.d.ts
// https://github.com/Cerlancism/mpv.d.ts/blob/master/mpv.d.ts
/*declare namespace mp {
  interface AddKeyBindingFlags {
    repeatable?: boolean | undefined;
    complex?: boolean | undefined;
    event?: "down" | "repeat" | "up" | "press" | undefined;
    is_mouse?: boolean | undefined;
    key_name?: string | undefined;
    key_text?: string | undefined;
  }

  interface OSDOverlay {
    data: string;
    res_x: number;
    res_y: number;
    z: number;
    update(): void;
    remove(): void;
  }

  interface OSDSize {
    width?: number | undefined;
    height?: number | undefined;
    aspect?: number | undefined;
  }

  interface FileInfo {
    mode: number;
    size: number;
    atime: number;
    mtime: number;
    ctime: number;
    is_file: boolean;
    is_dir: boolean;
  }

  function abort_async_command(t: unknown): void;

  function get_property_osd(name: string, def?: string): string;

  function get_property_bool(name: string, def: boolean): boolean;
  function get_property_bool(name: string, def?: boolean): boolean | undefined;

  function get_property_number(name: string, def: number): number;
  function get_property_number(name: string, def?: number): number | undefined;

  function get_property_native(name: string, def?: unknown): unknown;

  function set_property(name: string, value: string): true | undefined;

  function set_property_bool(name: string, value: boolean): true | undefined;

  function set_property_number(name: string, value: number): true | undefined;

  function set_property_native(name: string, value: unknown): true | undefined;

  function get_time(): number;

  function add_key_binding(
    key: string,
    name?: string,
    fn?: () => void,
    flags?: AddKeyBindingFlags
  ): void;

  function add_forced_key_binding(
    key: string,
    name?: string,
    fn?: () => void,
    flags?: AddKeyBindingFlags
  ): void;

  function remove_key_binding(name: string): void;

  function register_event(
    name: string,
    fn: (event: Record<string, unknown>) => void
  ): void;

  function unregister_event(fn: (...args: unknown[]) => void): void;

  function observe_property(
    name: string,
    type: "native",
    fn: (name: string, value: unknown) => void
  ): void;
  function observe_property(
    name: string,
    type: "bool",
    fn: (name: string, value: boolean | undefined) => void
  ): void;
  function observe_property(
    name: string,
    type: "string",
    fn: (name: string, value: string | undefined) => void
  ): void;
  function observe_property(
    name: string,
    type: "number",
    fn: (name: string, value: number | undefined) => void
  ): void;
  function observe_property(
    name: string,
    type: "none" | undefined,
    fn: (name: string) => void
  ): void;

  function unobserve_property(fn: (...args: unknown[]) => void): void;

  function get_opt(key: string): string;

  function get_script_name(): string;

  function osd_message(text: string, duration?: number): void;

  function register_idle(fn: () => void): void;

  function unregister_idle(fn: () => void): void;

  function enable_messages(level: LogLevel): void;

  function register_script_message(
    name: string,
    fn: (...args: unknown[]) => void
  ): void;

  function unregister_script_message(name: string): void;

  function create_osd_overlay(format: "ass-events"): OSDOverlay;

  function get_osd_size(): OSDSize | undefined;

  function add_hook(name: string, priority: number, fn: () => void): void;

  function last_error(): string;

  function get_time_ms(): number;

  function get_script_file(): string;

  let module_paths: string[];

  namespace options {
    function read_options(
      table: Record<string, string | boolean | number>,
      identifier?: string,
      on_update?: (list: Record<string, boolean | undefined>) => void
    ): void;
  }

  namespace utils {
    function getcwd(): string | undefined;

    function readdir(
      path: string,
      filter?: "files" | "dirs" | "normal" | "all"
    ): string[] | undefined;

    function file_info(path: string): FileInfo | undefined;

    function split_path(path: string): [string, string];

    function join_path(p1: string, p2: string): string;

    function getpid(): number;

    function getenv(name: string): string | undefined;

    function get_user_path(path: string): string;

    function read_file(fname: string, max?: number): string;

    function write_file(fname: string, str: string): void;

    function compile_js(
      fname: string,
      content_str: string
    ): (...args: unknown[]) => unknown;
  }
}

declare function print(...msg: unknown[]): void;

declare function dump(...msg: unknown[]): void;

declare function exit(): void;*/
