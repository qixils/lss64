# lss64

NodeCG bundle (graphics package) for Lexi's Super Scuffed 64

## Usage

Depends on https://github.com/qixils/nodecg-speedcontrol (and thus https://github.com/nodecg/nodecg (v1 for now))

Custom data in nodecg-speedcontrol is required via `/cfg/nodecg-speedcontrol.json` in your nodecg root:

```json
{
  "customData": {
    "player": [
      {
        "name": "Seed",
        "key": "seed"
      }
    ]
  }
}
```

Build with `npm run build` then just start the nodecg server

Graphics URLs can be found on the NodeCG dashboard.
Note that Nuxt will automatically remove the `.html` so be wary of refreshes...
I'll migrate away from it eventually but atm I'm sick of JS frameworks lol

## Licenses

This software is licensed under the [MIT license](LICENSE).
Additionally, several files have been copied from nodecg-speedcontrol,
which too is licensed under the [MIT license](https://github.com/speedcontrol/nodecg-speedcontrol/blob/master/LICENSE).
