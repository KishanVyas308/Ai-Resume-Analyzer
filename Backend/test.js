async function test() {
  await fetch(
    "https://www.naukri.com/jobapi/v4/job/050625501043?microsite=y&brandedConsultantJd=true&src=jobsearchDesk&sid=17564713317085918_1&xp=1&px=1&nignbevent_src=jobsearchDeskGNB",
    {
      headers: {
        appid: "121",

        nkparam:
          "Gyo7Jxq0UgPNeOcd7EkenM7u/KBbgvhPvPIep3QPfPTSXVwkv31utkreVi5sFgG+KTGKxVhAWai6Bg987Gr13Q==",
        systemid: "Naukri",
      },
      method: "GET",
    }
  ).then((response) => {
    response.json().then((data) => {
      console.log(data);
    });
  });
}
test();
