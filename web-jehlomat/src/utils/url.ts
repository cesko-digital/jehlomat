export function convertSearchParamsToString(params: Record<string, string>): string | undefined {
  const searchStringParams = new URLSearchParams(params).toString();
    return searchStringParams === "" ? undefined : `?${searchStringParams}`;
}

export function convertSearchStringToMap(params: string): URLSearchParams {
  return new URLSearchParams(params);
}

export function dataURLtoFile(dataurl: string, filename: string) {
    // @ts-ignore
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
