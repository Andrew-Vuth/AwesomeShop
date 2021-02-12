FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 4 / 3,
  imageResizeTargetWidth: 80,
  imageResizeTargetHeight: 100,
});

FilePond.parse(document.body);
