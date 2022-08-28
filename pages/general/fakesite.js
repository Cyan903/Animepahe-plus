// fakesite.js
//   fakesite-ignore
//
//  Ignore the "Beware of fake websites"
//  message.
//

function fakesite() {
    const fake = document.querySelector(".close-ann-fakesite");

    if (fake) {
        fake.click();
    }

    document.cookie = "ann-fakesite";
}

pahe["fakesite-ignore"] = fakesite;
