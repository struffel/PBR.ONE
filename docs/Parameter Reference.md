# Hashstring Parameters
The hashstring defines the parameters for the preview.
Parameters follow the pattern:
```
#<key>=<value>,<key>=<value>, ...
```

You don't need to set all parameters by hand, only those that you care about. The rest will be populated with default values. Below are the possible parameters for every kind of preview.



The parameters for `hdri-panorama` are:

|Key|Description|Possible Values|
| --- | --- | --- |
| `spheres_enable` | Show the light probe spheres in the center of the frame. | `0`=off, `1`=on |
| `environment_tonemapping` | Tonemapping style to use.  | `linear` (recommended for an analytical look) or `filmic` (for a "prettier" look with tonemapping.) |
|`environment_exposure`| Exposure offset in EVs. |Any integer or floating point number. Negative numbers lead to a darker image, positive numbers lead to a brighter image.|
|`environment_url`| Link to an equirectangular HDR panorama in `hdr` or `exr` file format.|URL ending in `.hdr` or `.exr`.|

The parameters for `pbr-material` are:

|Key|Description|Possible Values|
| --- | --- | --- |
| `color_url` | URL to the color map. | URL to the image file for the color map. |
| `color_encoding` | Encoding to use for the color map. | `sRGB` or `linear` |
| `normal_url` | URL to the normal map. | URL to the image file for the normal map. |
| `normal_encoding` | Encoding to use for the normal map. | `sRGB` or `linear` |
| `normal_scale`| Scale/strength of the normal map. | Any integer or floating point number. |
| `normal_type`| Type of normal map. | `opengl` or `directx` |
| `displacement_url` | URL to the displacment map. | URL to the image file for the displacment map. |
| `displacement_encoding` | Encoding to use for the displacement map. | `sRGB` or `linear` |
| `roughness_url` | URL to the roughness map. | URL to the image file for the roughness map. |
| `roughness_encoding` | Encoding to use for the roughness map. | `sRGB` or `linear` |
| `metalness_url` | URL to the metalness map. | URL to the image file for the metalness map. |
| `metalness_encoding` | Encoding to use for the metalness map. | `sRGB` or `linear` |
| `ambientocclusion_url` | URL to the ambient occlusion map. | URL to the image file for the ambient occlusion map. |
| `ambientocclusion_encoding` | Encoding to use for the ambient occlusion map. | `sRGB` or `linear` |
| `opacity_url` | URL to the opacity map. | URL to the image file for the opacity map. |
| `opacity_encoding` | Encoding to use for the opacity map. | `sRGB` or `linear` |
| `environment_url` | Link to an equirectangular HDR panorama in `hdr` or `exr` file format.|URL ending in `.hdr` or `.exr`.|
| `geometry_type` | Defines the preview object. | `cube` `cylinder` `sphere` `plane` |
| `geometry_subdivisions` | Number of subdivisions. | Integer number |
| `tiling_scale` | Texture scaling. | Integer or floating point number. |
