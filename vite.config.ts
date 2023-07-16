import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from 'fs';

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), rawFonts([".woff"])],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});

// adapted from mattjennings
// https://github.com/mattjennings/mattjennings.io/blob/master/vite.config.js
function rawFonts(ext) {
	return {
		name: 'vite-plugin-raw-fonts',
		resolveId(id) {
			return ext.some((e) => id.endsWith(e)) ? id : null;
		},
		transform(code, id) {
			if (ext.some((e) => id.endsWith(e))) {
				const buffer = fs.readFileSync(id);
				return { code: `export default ${JSON.stringify(buffer)}`, map: null };
			}
		}
	};
}
