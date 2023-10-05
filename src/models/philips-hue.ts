import { z } from 'zod'

const philips_hue_light_capabilities_schema = z.object({
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

type PhilipsHUELightCapabilities = z.infer<
  typeof philips_hue_light_capabilities_schema
>

export const philips_hue_light_schema = z.object({
  state: z.object({
    on: z.boolean(),
    bri: z.number(),
    hue: z.number(),
    sat: z.number(),
    effect: z.string(),
    xy: z.tuple([z.number(), z.number()]),
    ct: z.number(),
    alert: z.string(),
    colormode: z.string(),
    mode: z.string(),
    reachable: z.boolean(),
  }),
  swupdate: z.object({
    state: z.string(),
    lastinstall: z.string(),
  }),
  type: z.string(),
  name: z.string(),
  modelid: z.string(),
  manufacturername: z.string(),
  productname: z.string(),
  capabilities: philips_hue_light_capabilities_schema,
  config: z.object({
    archetype: z.string(),
    function: z.string(),
    direction: z.string(),
    startup: z.object({
      mode: z.string(),
      configured: z.boolean(),
    }),
  }),
  uniqueid: z.string(),
  swversion: z.string(),
  swconfigid: z.string(),
  productid: z.string(),
})

export const philips_hue_lights_response_schema = z.record(
  philips_hue_light_schema,
)
type PhilipsHUELightsResponse = z.infer<
  typeof philips_hue_lights_response_schema
>

export type PhilipsHUELight = z.infer<typeof philips_hue_light_schema>
