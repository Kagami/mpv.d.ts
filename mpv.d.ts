// Types for mpv JavaScript API (MuJS runtime). Reference:
// https://github.com/mpv-player/mpv/blob/master/DOCS/man/javascript.rst
// https://github.com/mpv-player/mpv/blob/master/DOCS/man/input.rst
// https://github.com/mpv-player/mpv/blob/master/DOCS/man/lua.rst

declare global {
  var mp: {
    // Scripting APIs - identical to Lua
    command(command: string): true | undefined;
    commandv(...args: string[]): true | undefined;
    command_native(table: MP.CommandArgs): unknown;
    command_native_async(table: MP.CommandArgs, fn?: (success: boolean, result: unknown, error: string) => void): unknown;
    abort_async_command(id: unknown): void;

    del_property(name: string): true | undefined;
    get_property(name: string): string | undefined;
    get_property(name: string, def: string): string;
    get_property_osd(name: string): string | undefined;
    get_property_osd(name: string, def: string): string;
    get_property_bool(name: string): boolean | undefined;
    get_property_bool(name: string, def: boolean): boolean;
    get_property_number(name: string): number | undefined;
    get_property_number(name: string, def: number): number;
    get_property_native(name: string, def?: unknown): unknown;
    set_property(name: string, value: string): true | undefined;
    set_property_bool(name: string, value: boolean): true | undefined;
    set_property_number(name: string, value: number): true | undefined;
    set_property_native(name: string, value: unknown): true | undefined;

    get_time(): number;

    add_key_binding(key: string, name?: string, fn?: () => void, flags?: MP.KeyBindingFlags): void;
    add_forced_key_binding(key: string, name?: string, fn?: () => void, flags?: MP.KeyBindingFlags): void;
    remove_key_binding(name: string): void;
    register_event(name: string, fn: (event: MP.Event) => void): void;
    unregister_event(fn: (...args: unknown[]) => void): void;
    observe_property(name: string, type: "native", fn: (name: string, value: unknown) => void): void;
    observe_property(name: string, type: "bool", fn: (name: string, value: boolean | undefined) => void): void;
    observe_property(name: string, type: "string", fn: (name: string, value: string | undefined) => void): void;
    observe_property(name: string, type: "number", fn: (name: string, value: number | undefined) => void): void;
    observe_property(name: string, type: "none" | undefined, fn: (name: string) => void): void;
    unobserve_property(fn: (...args: unknown[]) => void): void;

    get_opt(key: string): string;
    get_script_name(): string;
    get_script_directory(): string;
    osd_message(text: string, duration?: number): void;
    get_wakeup_pipe(): number;

    register_idle(fn: () => void): void;
    unregister_idle(fn: () => void): void;
    enable_messages(level: MP.LogLevel): void;
    register_script_message(name: string, fn: (...args: unknown[]) => void): void;
    unregister_script_message(name: string): void;

    create_osd_overlay(format: "ass-events" | "none"): MP.OSDOverlay;
    get_osd_size(): MP.OSDSize | undefined;
    /** @deprecated osd-ass legacy API */
    set_osd_ass(res_x: number, res_y: number, data: string): unknown;

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
      getcwd(): string | undefined;
      readdir(path: string, filter?: MP.ReadDirFilter): string[] | undefined;
      file_info(path: string): MP.FileInfo | undefined;
      split_path(path: string): [string, string];
      join_path(p1: string, p2: string): string;
      /** @deprecated legacy wrapper */
      subprocess(t: unknown): unknown;
      /** @deprecated legacy wrapper */
      subprocess_detached(t: unknown): unknown;
      get_env_list(): string[];
      getpid(): number;

      // Additional utilities
      getenv(name: string): string | undefined;
      get_user_path(path: string): string;
      read_file(fname: string, max?: number): string;
      write_file(fname: string, str: string): void;
      append_file(fname: string, str: string): void;
      compile_js(fname: string, content_str: string): (...args: unknown[]) => unknown;
    };

    add_hook(type: string, priority: number, fn: () => void): void;

    options: {
      read_options(obj: MP.Options, identifier?: string, on_update?: (list: MP.OptionsUpdate) => void): void;
    };

    // TODO: types
    // https://github.com/mpv-player/mpv/blob/master/DOCS/man/lua.rst#mpinput-functions
    input: {
      get(obj: unknown): true | undefined;
      terminate(): void;
      log(message: string, style: string): void;
      log_error(message: string): void;
      set_log(log: unknown): void;
    };

    // The event loop
    wait_event(wait: number): MP.Event;
    dispatch_event(e: MP.Event): void;
    process_timers(): number;
    notify_idle_observers(): void;
    peek_timers_wait(): number;

    // Additional utilities
    last_error(): string;
    get_time_ms(): number;
    get_script_file(): string;
    module_paths: string[];
  };

  // Timers (global)
  function setTimeout(handler: string | Function, timeout?: number, ...arguments: any[]): number;
  function clearTimeout(id: number | undefined): void;
  function setInterval(handler: string | Function, timeout?: number, ...arguments: any[]): number;
  function clearInterval(id: number | undefined): void;

  // Additional utilities
  function print(...msg: unknown[]): void;
  function dump(...msg: unknown[]): void;
  function exit(): void;
}

// Auxiliary types are kept in separate namespace to not be confused with official API.
export namespace MP {
  type NodeArray = unknown[];
  type NodeMap = { [key: string]: unknown };

  type Option = string | boolean | number;
  type Options = { [key: string]: Option };
  type OptionsUpdate = { [key: string]: boolean };

  type LogLevel = "fatal" | "error" | "warn" | "info" | "v" | "debug" | "trace";
  type KeyEventType = "down" | "repeat" | "up" | "press";
  type ReadDirFilter = "files" | "dirs" | "normal" | "all";
  type Platform = "windows" | "darwin" | "linux" | "android" | "freebsd" | string;

  // TODO: fields
  // https://mpv.io/manual/master/#list-of-events
  interface Event {
    event: string;
    id?: unknown;
    error?: string;
    [key: string]: unknown;
  }

  interface KeyBindingFlags {
    repeatable?: boolean;
    complex?: boolean;
    event?: KeyEventType;
    is_mouse?: boolean;
    key_name?: string;
    key_text?: string;
    [key: string]: unknown;
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
    width: number;
    height: number;
    aspect: number;
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

  interface MousePos {
    x: number;
    y: number;
    hover: boolean;
  }

  // TODO: fields
  // https://mpv.io/manual/master/#command-interface-video-params
  interface VideoParams {
    w: number;
    h: number;
    dw: number;
    dh: number;
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
