import { z } from 'zod'
import { PhilipsHUELight } from './philips-hue'

const hewey_light_capabilities_schema = z.object({
  certified: z.boolean(),
  control: z.object({
    mindimlevel: z.number(),
    maxlumen: z.number(),
    colorgamuttype: z.string(),
    colorgamut: z.tuple([z.number(), z.number()]).array(),
    ct: z.object({
      min: z.number(),
      max: z.number(),
    }),
  }),
  streaming: z.object({
    renderer: z.boolean(),
    proxy: z.boolean(),
  }),
})

type HeweyLightCapabilities = z.infer<typeof hewey_light_capabilities_schema>

const hewey_light_state_schema = z.object({
  on: z.boolean(),
  brightness: z.number(),
  hue: z.number(),
  saturation: z.number(),
  effect: z.string(),
  mode: z.string(),
  reachable: z.boolean(),
})

type HeweyLightState = z.infer<typeof hewey_light_state_schema>

const hewey_light_product_schema = z.object({
  id: z.string(),
  name: z.string(),
  manufacturer: z.string(),
  software_version: z.string(),
  software_config_id: z.string(),
})

type HeweyLightProduct = z.infer<typeof hewey_light_product_schema>

const hewey_light_config_schema = z.object({
  archetype: z.string(),
  function: z.string(),
  direction: z.string(),
  startup: z.object({
    mode: z.string(),
    configured: z.boolean(),
  }),
})
type HeweyLightConfig = z.infer<typeof hewey_light_config_schema>

const hewey_light_schema = z.object({
  unique_id: z.string(),
  type: z.string(),
  name: z.string(),
  state: hewey_light_state_schema,
  capabilities: hewey_light_capabilities_schema,
  product: hewey_light_product_schema,
  config: hewey_light_config_schema,
})

type HeweyLight = z.infer<typeof hewey_light_schema>

export function to_hewey_light(phl: PhilipsHUELight): HeweyLight {
  return {
    capabilities: phl.capabilities,
    config: phl.config,
    name: phl.name,
    product: {
      id: phl.productid,
      manufacturer: phl.manufacturername,
      name: phl.productname,
      software_config_id: phl.swconfigid,
      software_version: phl.swversion,
    },
    state: {
      brightness: phl.state.bri,
      effect: phl.state.effect,
      hue: phl.state.hue,
      mode: phl.state.mode,
      on: phl.state.on,
      reachable: phl.state.reachable,
      saturation: phl.state.sat,
    },
    type: phl.type,
    unique_id: phl.uniqueid,
  }
}
