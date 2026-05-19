export function render(view: string, model?: object, options?: object): string;
export function render(view: { getPath(): string } | object, model?: object, options?: object): string;
