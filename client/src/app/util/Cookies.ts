export function getCookie(key: string) {
    var cookieValue = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return cookieValue ? cookieValue.pop() : "";
  }