const REGEX = {
  dnt: /.*\.dnt$/i,
  jobicon: /^\\resource\\ui\\mainbar\\jobicon.*/i,
  skillicon: /^\\resource\\ui\\mainbar\\skillicon.*/i,
  uistring: /^\\resource\\uistring\\uistring\.xml$/i,
  uitemplatetexture: /uit_gesturebutton\.dds/i,
  skilltree: /^\\resource\\ui\\skill\\.*\.dds/i,
};

const REGEX_KEYS = Object.keys(REGEX);

function filter(pakFile) {
  for (let key in REGEX) {
    const pathMatches = REGEX[key].test(pakFile.getPath());
    const exists = pakFile.getCompressedSize() != 0 && pakFile.getSize() != 0;

    if (pathMatches && exists) {
      return true;
    }
  }

  return false;
}

