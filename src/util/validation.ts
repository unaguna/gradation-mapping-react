import { validate as validateBySchema } from "jsonschema";

export function validateNumber(value: string, required?: boolean): string | null {
  if ((!required || value !== "") && value.match(/^-?[0-9]*\.?[0-9]*$/)) {
    return null;
  } else {
    return "数値である必要があります。";
  }
}

export function validatePositiveNumber(value: string, required?: boolean): string | null {
  if ((!required || value !== "") && value.match(/^[0-9]*\.?[0-9]*$/) && parseFloat(value) > 0) {
    return null;
  } else {
    return "正の数値である必要があります。";
  }
}

export function validateInteger(value: string, required?: boolean): string | null {
  if ((!required || value !== "") && value.match(/^-?[0-9]*$/)) {
    return null;
  } else {
    return "整数値である必要があります。";
  }
}

export function validateColorscaleJson(value: string, required?: boolean): string | null {
  if (!required && value === "") return null;

  let parsedValue;
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    return "JSON形式である必要があります。";
  }

  const validationResult = validateBySchema(parsedValue, colorscaleSchema);

  if (validationResult.valid) {
    return null;
  } else {
    return "colorscale として正しいオブジェクトである必要があります。" + validationResult.errors.map(e => ["colorscale", ...e.path].join(".") + " " + e.message).join(", ");
  }
}

const colorscaleSchema = {
  "type": "array",
  "items": {
    "type": "array",
    "items": [
      { "type": "number", "minimum": 0, "maximum": 1 },
      { "type": "string" },
    ],
    "additionalItems": false,
  },
};
