fetch("https://smartstore.naver.com/i/v1/contents/reviews/query-pages", {
  headers: {
    accept: "application/json, text/plain, */*",
    "accept-language": "ko-KR,ko;q=0.5",
    "content-type": "application/json",
    priority: "u=1, i",
    "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-gpc": "1",
    "x-client-version": "20250331225804",
    cookie:
      'NNB=JU4ERZXQWGRGO; NAC=cQh0BgQPt0Yv; ASID=799db9400000019515e6f37200000019; SRT30=1743493055; SRT5=1743493055; _fwb=163JKZPsK7mAtG0yxhbGzYR.1743493172842; CBI_SES=vlSI+j+GdYuF7xprxrL4yiqFiQKikqT/oR9rj3bE+tVot/mqKvb0S9spesA6Hi2+XZkPyjLgulv9XQGBMeqVQOKnjaqKRH4S+ZuH84a10VP1jqbms/l2B+nO4Jc/O3bVsCcUnEJ1rC65tNhVw8mUDL22MedE60we1y4NzFYjjhKS5uexxLQyyzECK129x7tH0+UQKysxZOyd4SqlGzzF00h0RQa4125VyOGw1PNBx8CuXaVrOfFP8DeiQ2BGNadEIyEACDbs3BwT9dSkcG5cBHRjQQFYSrnuq/JQjf6YF1Zqn9BP9xh+X+2nu77/X58vq1owUkXXHQkQAQST3HshnvN8S2jQArDIAHsXJcIk1LT2CYpVccp5jxu9cCpiIdUxhVm1yUhvIeTNkFiwF4YIny+1RCJ5YxipWeR/demBCCq50GRCVfzf+dGUytyzsZ6H/Ap5A0ukCqAIzLzwp3/a1Q==; CBI_CHK="r5V0mf9uRUZHZ/vmLGy3ez7f4/k4aqWXL5o03eN68fos0JnOydM7fvQquESj/F4/v7eZUY79enSmYu6DFvQUzJUKqB+dwQz0kdByUTxy8TrWIo9twELNTBdMtMzktNtAJqNjx5ymJadMRa1psN+V57gcRItfUT33/suSAtdEjNg="; NACT=1; _naver_usersession_=aFzoS0uSspy9TfQZ9V5t3Z54; nid_inf=1936284710; NID_AUT=lPBfo2BwX21Wtc+wZoS9XO0kNO2CA3ywlWBF2NDHvPI0J++smF+Mj0UvJCHSnCxc; NID_JKL=rCxE7GRyza2YxOic21wqaOinC5vVhxzUlNetGrLmsao=; NID_SES=AAABwxsBRpsphv1Nqiwv3qnnpzLwDxqijSW/fX8RtLRf6ObPiG8D0gQPngzcqwc7OwZpWM3hHV8hU06skKggE+9Cta4dtlB+u66r03hVRjofrzl6GScGUuGtWqJj3X4igSCI5rshbv8PDk6KvScAcznNO/PGYHoa3TtLnPmDuxIpO8MW/CoyzJHepq6XN/3IDXjqq09iijf+OY+cI2cDSA6JYc+T1Y+wOh75x1cOPkGl+QpOk96wVOf/vFcTRTSHVJ7gisQBM7lHvPmfjqiQLawVbg8cKtMXvI+zexeZMXV+SWGk71jN0CbLgsZKs0fpUDEtnAe+0+vZ6noljuGbvq2kUPNexUF1fce2MgKy3/85UOcz18RN/JdvfcQSny0+PVQFCeBUFcu9bH3XQpJ8ypen26hCotAh7m+tK6Cb+nCUpBk7Jg+3Qu9wo2Q3CKfDdKb0T0UQumiksmb9ATvwWgfftYGcJDI4oXvGNk40Oq/66eoWlD0bCrWUtVuqyBkX1kW3Xjcbi6uvSRD6GTke+SGXjNXiAr/3+OT3CGsLeyMmNtBnzpiozpkWPOkpZRbUMujXVe/+5cTkaQwGSgYM3FvtFDXzbOrYfmRVtlMLQIQC4TyA; page_uid=i+XkxlqVN8VssOjHlgsssssssxR-045424; BUC=57BFgDDCKX6-Exu3s-n7nAxY3al1oZu3OAhiKzEHCUY=',
    Referer:
      "https://smartstore.naver.com/flytojapan/products/2199764342?nl-query=%ED%95%B4%ED%94%BC%ED%95%B4%ED%82%B9&nl-ts-pid=i%2BXkxlqVN8VssOjHlgsssssssxR-045424&NaPm=ct%3Dm8y7d4x4%7Cci%3Dc7ee93abcceb20f5f14808819c5a9caf759d9989%7Ctr%3Dsls%7Csn%3D541918%7Chk%3D3d22b56cb187cb11c445088a170dc3819ef3b54e",
    "Referrer-Policy": "no-referrer-when-downgrade",
  },
  body: '{"checkoutMerchantNo":510028501,"originProductNo":2198440821,"page":2,"pageSize":20,"reviewSearchSortType":"REVIEW_RANKING"}',
  method: "POST",
}).then(async (res) => console.log(await res.json()));
