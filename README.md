# Ward Nurse Scheduler

台大醫院（NTUH）OpenWard 護理派班工具，**目前僅支援 6A 病房**。工具會從已開啟的查詢結果讀取床號、EWS 與出院日期，若出院日期為當天，白班模式會自動勾選「出院」，再於瀏覽器內計算白班、小夜及大夜的派班。

<!-- bookmarklet:start -->
[開啟書籤安裝頁](https://weijyun9008.github.io/ward-nurse-scheduler/)

<details><summary>手動複製書籤網址與查看 SHA-256</summary>

<p>SHA-256 <code>02b1cdd04e7751e5b0c065d9659756a6edb8a88a000cdee01b97456f6152deb7</code></p>

```text
javascript:void(function(){!function(e,t){if(/\/OpenWard\.aspx$/i.test(location.pathname))if(0===e.indexOf("https://"))try{var%20n=window.msCrypto||window.crypto;if(!n||!n.subtle)return%20void%20o("Web%20Crypto%20unavailable.%20Document%20mode:%20"+(document.documentMode||"modern"));var%20r=new%20XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.timeout=1e4,r.onerror=r.ontimeout=function(){o("Download%20failed.%20Check%20URL,%20network,%20and%20CORS.")},r.onload=function(){try{if(200!==r.status||!r.response)return%20void%20o("Download%20failed.%20HTTP%20status:%20"+r.status);var%20e=n.subtle.digest({name:"SHA-256"},r.response);function%20a(){o("SHA-256%20check%20failed.")}function%20i(e){try{var%20n,a=new%20Uint8Array(e),i="";for(n=0;n<a.length;n++)i+=("0"+a[n].toString(16)).slice(-2);if(i!==t)return%20void%20o("SHA-256%20mismatch.%20Script%20not%20run.");var%20s=new%20Uint8Array(r.response),c="";for(n=0;n<s.length;n++)c+=String.fromCharCode(s[n]);(0,eval)(c)}catch(e){o(e.message)}}e.then%3Fe.then(i,a):(e.onerror=a,e.oncomplete=function(e){i(e.target.result)})}catch(s){o(s.message)}},r.send()}catch(e){o(e.message)}else%20alert("Set%20the%20HTTPS%20dispatch%20script%20URL%20in%20the%20bookmark%20first.");else%20alert("Open%20OpenWard.aspx%20first.");function%20o(e){alert("6A:%20"+e)}}("https://raw.githubusercontent.com/weijyun9008/ward-nurse-scheduler/scheduler-snapshot/nurse-scheduler.js","02b1cdd04e7751e5b0c065d9659756a6edb8a88a000cdee01b97456f6152deb7");}());
```

</details>
<!-- bookmarklet:end -->

1. 開啟安裝頁，將「6A 護理派班」拖到書籤列。
2. 在 OpenWard 查出 6A 的床況，確認 A1、A2 兩區都有在床病人，再點書籤。

書籤會從 GitHub 下載指定版本的程式並核對 SHA-256。更新時，從安裝頁重新拖曳即可。床況在瀏覽器內處理。

`nurse-scheduler.js` 更新到 `main` 後，GitHub Actions 會重算 SHA-256、更新本頁的書籤內容並產生安裝頁。公開部署使用 GitHub Pages 的 GitHub Actions 來源。

