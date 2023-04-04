# Installation/Hosting
In general, all you need to do is make the contents of the `/src` subfolder  of this repository along with the media files (material maps or HDRIs) accessible on the internet. Both parts of this can be achieved in multiple ways.

## Hosting the source code
### Self-Hosting
You can host PBR.ONE by simply uploading the files as static assets to your own hosting solution. No backend (Node/PHP/etc.) is required.

1. Clone this Repo or download it from Github.com
2. Upload the contents of the `/src` folder to your web server, for example into `/previews` or any other subdirectory.

### Via CDN (Content Delivery Network)
Alternatively you can use `https://cdn.pbr.one/<version>/<view>` (for example `https://cdn.pbr.one/0.3.0/hdri-panorama.html`) to get the files without hosting them yourself. Though you still need to get your own media files online. PBR.ONE currently does not offer hosting services for them.

## Hosting your media files
### Along with the source code
If you have uploaded the source code to your own server then you can do the same with your media files. Just serve them in any other subdirectory (like `/previews-media`) to which you can then link.

### On a separate service
Alternatively you can use numerous image hosting services to serve the materal maps for your preview.
You just need to make sure that the service supports *Cross-Origin Ressource Sharing* to ensure that the images can be loaded by the PBR.ONE view on another domain.

A few (non-sponsored) suggestions are:
- [Imgur](https://imgur.com/) (CORS by default, but make sure to link the image itself, not the gallery)
- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) (Create a public bucket enable CORS in the **CORS Rules** section for your bucket.)
- [Bunny CDN](https://bunny.net/) (CORS can be enabled by going to the **Headers** section in the pull zone settings and adding entries for the required file extensions.)
