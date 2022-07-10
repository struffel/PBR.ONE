# PBR.ONE
 
PBR.ONE is a set of HTML pages that can be embedded into any website to quickly and easily create interactive previews of PBR materials and HDRI environment maps right in the browser.
Resources can be loaded by simply adding URLs into the hashstring of the page and the page dynamically adjusts as the string changes to allow for interactive switching of environments or PBR maps.

Here is what a link to one of these views might look like:
```
/hdri-panorama.html#environment_url=./media/env-sunny.exr,environment_exposure=-2
```

# Installation
## Without your own website

## On your own website
### Via local Hosting
You can embed PBR.ONE on your site like this:

1. Clone this Repo or download it from Github.com
2. Upload the contents of the `/src` folder to your web server, for example into `/previews` or any other subdirectory.
3. Upload the HDRI environment or PBR maps that you want to show off to your server as well, for example into `/assets`.
4. Embed one of the pages using an iframe, as shown below. You can read the section "Crafting the Hashstring" to figure out the correct parameters.
```
<!-- Example 1, showing custom PBR maps -->

<iframe src="https://example.com/previews/hdri-panorama.html#color_url=/assets/color.jpg,normal_url=/assets/normal.jpg">

<!-- Example 2, opening the HDRI viewer with one of the included panoramas -->

<iframe src= "https://example.com/previews/hdri-panorama.html#environment_url=./media/env-sunny.exr,environment_exposure=-2">
```
### Via CDN
(Coming soon).

# Crafting the Hashstring
The hashstring defines the parameters for the material preview.
Parameters follow the pattern:
```
#<key>=<value>,<key>=<value>, ...
```

You don't need to set all parameters by hand, only those that you care about. The rest will be populated with default values.

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
| `scale_x` | Texture scaling (X). | Integer or floating point number. |
| `scale_y` | Texture scaling (Y). | Integer or floating point number. |