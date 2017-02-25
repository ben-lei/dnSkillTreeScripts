const REGEX = {
  dnt: /.*\.dnt$/i,
  jobicon: /^\\resource\\ui\\mainbar\\jobicon.*/i,
  skillicon: /^\\resource\\ui\\mainbar\\skillicon.*/i,
  uistring: /^\\resource\\uistring\\uistring\.xml$/i,
  uitemplatetexture: /uit_gesturebutton\.dds/i,
  skilltree: /^\\resource\\ui\\skill\\.*\.dds/i,
};

const IGNORE_REGEX = {
  dds: /(1_awaken|adepte|classinfobg|elestra_awaken|jobicon_pvp|warlord|tree_.*)\.dds$/i,
};

function filter(pakFile) {
  for (let key in REGEX) {
    const pathMatches = REGEX[key].test(pakFile.getPath());
    const exists = pakFile.getCompressedSize() != 0 && pakFile.getSize() != 0;

    if (pathMatches && exists) {
      let ignore = false;
      for (let key2 in IGNORE_REGEX) {
        if (IGNORE_REGEX[key2].test(pakFile.getPath())) {
          ignore = true;
          break;
        }
      }

      if (!ignore) {
        return true;
      }
    }
  }

  return false;
}

