# Parameter Reference
This document describes how to construct the PBR.ONE preview URL and describes all the parameters that can be used in it.
## General URL Construction
The hashstring (everything after the `#`) defines the parameters for the preview.
Parameters follow the same pattern as those in an HTTP query.
Values are separated using '&':
```
https://cdn.pbr.one/example.html#<key>=<value>&<key>=<value>& ...
```
Some parameters allow lists of values to choose from using the GUI. In that case the pattern the values are separated using a comma (,) like this:
```
https://cdn.pbr.one/example.html#<key>=<valueA>,<valueB>&<key>=<valueA>,<valueB>, ...
```
You don't need to set all parameters by hand, only those that actually want to change. The rest will be populated with default values. 
Below are the possible views and their parameters.

## `hdri-exposure.html`
This view shows an HDR image as-is to evaluate its dynamic range.

| Key | Description | Possible Values |
| --- | --- | --- |
|`environment_url` <span style="opacity:0%;user-select:none;" >PADDING_PADDING_PADDING</span>| Link to one or multiple equirectangular HDR panoramas in `hdr` or `exr` file format.|Comma-separated list of URLs ending in `.hdr` or `.exr`. |
|`environment_name`| List of names for the environments. Required if more than one environment is used. |Comma-separated list of Strings.|
|`environment_index`| Describes which environment should be displayed (if multiple are specified in the URL list.) |`0` (for the first environment)<br> `1` (for the second environment)<br> ...|
| `environment_tonemapping` | Tonemapping style to use. | `linear` (recommended for an analytical look) or `filmic` (for a "prettier" look with tonemapping.) |
| `environment_exposure` | Exposure offset in EVs. | Any integer or decimal number. Negative values darken the image, positive brighten it. |
| `watermark_enable` | Enables or disables the PBR.ONE watermark. | `2` = large (default)<br> `1` = small<br> `0` = off |
| `gui_enable` | Enables or disables the GUI in the top left corner. | `1` = enabled on start (default)<br> `0` = disabled on start<br> `-1` = disabled entirely |

## `hdri-shading.html`
This view shows the HDRI map with three reference balls to evaluate the lighting that it creates.

| Key | Description | Possible Values |
| --- | --- | --- |
| `spheres_enable` <span style="opacity:0%;user-select:none;" >PADDING_PADDING_PADDING</span>| Show the light probe spheres in the center of the frame. | `0`=off<br> `1`=on (default) |
| `spheres_accent_color` | Set the color of the middle sphere. | Hex color code, like `116DD5` (default) |
| `environment_tonemapping` | Tonemapping style to use. | `linear` (recommended for an analytical look) or `filmic` (for a "prettier" look with tonemapping.) |
| `environment_exposure` | Exposure offset in EVs. | Any integer or decimal number. Negative values darken the image, positive brighten it. |
| `environment_url`| Link to one or multiple equirectangular HDR panoramas in `hdr` or `exr` file format.|Comma-separated list of URLs ending in `.hdr` or `.exr`. |
| `environment_name`| List of names for the environments. Required if more than one environment is used. |Comma-separated list of strings.|
| `environment_index`| Describes which environment should be displayed (if multiple are specified in the URL list.) |`0` (for the first environment)<br> `1` (for the second environment)<br> ...|
| `watermark_enable` | Enables or disables the PBR.ONE watermark. | `2` = large (default)<br> `1` = small<br> `0` = off |
| `gui_enable` | Enables or disables the GUI in the top left corner. | `1` = enabled on start (default)<br> `0` = disabled on start<br> `-1` = disabled entirely |

## `material-shading.html`
This view shows a full PBR material on a preview object.

|Key|Description|Possible Values|
| --- | --- | --- |
| `color_url` <span style="opacity:0%;user-select:none;" >PADDING_PADDING_PADDING</span> | URL to one or multiple color maps. | Comma-separated list of URLs to image files. |
| `color_encoding` | Encoding to use for the color map. | `sRGB` or `linear` |
| `normal_url` | URL to one or multiple normal maps. | Comma-separated list of URLs to image files. |
| `normal_encoding` | Encoding to use for the normal map. | `sRGB` or `linear` |
| `normal_scale`| Scale/strength of the normal map. | Any integer or floating point number. |
| `normal_type`| Type of normal map. | `opengl` or `directx` |
| `displacement_url` | URL to one or multiple displacment maps. | Comma-separated list of URLs to image files. |
| `displacement_encoding` | Encoding to use for the displacement map. | `sRGB` or `linear` |
| `roughness_url` | URL to one or multiple roughness map. | Comma-separated list of URLs to image files. |
| `roughness_encoding` | Encoding to use for the roughness map. | `sRGB` or `linear` |
| `metalness_url` | URL to one or multiple metalness maps. | Comma-separated list of URLs to image files. |
| `metalness_encoding` | Encoding to use for the metalness map. | `sRGB` or `linear` |
| `ambientocclusion_url` | URL to one or multiple ambient occlusion maps. | Comma-separated list of URLs to image files. |
| `ambientocclusion_encoding` | Encoding to use for the ambient occlusion map. | `sRGB` or `linear` |
| `opacity_url` | URL to one or multiple opacity maps. | Comma-separated list of URLs to image files. |
| `opacity_encoding` | Encoding to use for the opacity map. | `sRGB` or `linear` |
| `material_name`| List of names for the materials. Required if more than one material is used. |Comma-separated list of Strings.|
| `material_index`|Describes which environment should be displayed (if multiple are specified).|`0` (for the first material)<br> `1` (for the second material)<br> ...|
| `environment_url`| Link to one or multiple equirectangular HDR panoramas in `hdr` or `exr` file format.|Comma-separated list of URLs ending in `.hdr` or `.exr`. |
| `environment_name`| List of names for the environments. Required if more than one environment is used. |Comma-separated list of Strings.|
| `environment_index`| Describes which environment should be displayed (if multiple are specified in the URL list.) |0 (for the first environment).|`0` (for the first environment)<br> `1` (for the second environment)<br> ...|
| `geometry_type` | Defines the preview object. | `cube`<br> `cylinder`<br> `sphere`<br> `plane` |
| `geometry_subdivisions` | Number of subdivisions. | Integer number |
| `displacement_scale` | Initial strength of the displacement. | Integer or floating point number. |
| `tiling_scale` | Texture scaling. | Integer or floating point number. |
| `clayrender_enable`| Displays a clayrender (by disabling the color map)|`0` or `1`|
| `watermark_enable` | Enables or disables the PBR.ONE watermark. | `2` = large (default)<br> `1` = small<br> `0` = off |
| `gui_enable` | Enables or disables the GUI in the top left corner. | `1` = enabled on start (default)<br> `0` = disabled on start<br> `-1` = disabled entirely |

## `texture-tiling.html`
This view shows individual texture maps in a tiled view.

|Key|Description|Possible Values|
| --- | --- | --- |
| `texture_url` <span style="opacity:0%;user-select:none;" >PADDING_PADDING_PADDING</span> | URL to one or multiple textures. | Comma-separated list of URLs to image files. |
| `texture_name`| List of names for the textures. Required if more than one texture is used. |Comma-separated list of Strings.|
| `texture_index`|Describes which environment should be displayed (if multiple are specified).|
| `texture_size` | Default scaling of the texture. | Integer or floating point number. |
| `watermark_enable` | Enables or disables the PBR.ONE watermark. | `2` = large (default)<br> `1` = small<br> `0` = off |
| `gui_enable` | Enables or disables the GUI in the top left corner. | `1` = enabled (default)<br> `0` = disabled |
