# mpv.d.ts

TypeScript definitions for mpv JavaScript API.

## Install

```bash
npm i -D mpv.d.ts
```

## Usage

Example tsconfig.json:

```json
{
  "compilerOptions": {
    "lib": ["ES5"],
    "target": "ES5",
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

Note the `lib` and `target` options, those are correspond to MuJS runtime capabilities (mpv's scripting backend).

You can also import auxiliary types which are not part of the official API but provided for convenience:

```typescript
import type { MP } from "mpv.d.ts";

const encoders = mp.get_property_native("encoder-list") as MP.Prop.Encoder[];
mp.msg.info(encoders.length);

mp.command_native_async(
  {
    name: "subprocess",
    args: ["echo", "test"],
    playback_only: false,
    capture_stdout: true,
  } satisfies MP.Cmd.SubprocessArgs,
  (success, res: MP.Cmd.SubprocessResult, error) => {
    mp.msg.info(res.stdout);
  }
);
```
