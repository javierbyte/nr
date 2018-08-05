function throttle(callback, wait, context = this) {
  let timeout = null;
  let callbackArgs = null;

  const later = () => {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return function() {
    if (!timeout) {
      callbackArgs = arguments;
      timeout = setTimeout(later, wait);
    }
  };
}

const lamarEl = document.querySelector(".js-lamar");
const nrQuoteEl = document.querySelector(".nr-quote");

lamarEl.addEventListener("click", function() {
  nrQuoteEl.classList.toggle("-hide");
});

function fixSectionTitle() {
  document.querySelectorAll(".section_title").forEach(el => {
    const offsetMargin = el.getBoundingClientRect().height;
    const spacerEl = document.querySelector(
      `.section_title_spacer[data-section="${el.dataset.section}"]`
    );
    spacerEl.style.marginBottom = -1 * Math.round(offsetMargin) + "px";
  });
}
const throttledFixSectionTitle = throttle(fixSectionTitle, 15);
window.addEventListener("resize", throttledFixSectionTitle);
fixSectionTitle();

const workEntryElArray = document.querySelectorAll(".section_work_entry");

function onScroll() {
  let done = false;

  for (el of workEntryElArray) {
    if (
      !done &&
      el.getBoundingClientRect().top > window.innerHeight / 15 + 10
    ) {
      el.classList.remove("-off");
      done = true;
    } else {
      el.classList.add("-off");
    }
  }
}
const throttledOnScroll = throttle(onScroll, 15);
window.addEventListener("scroll", throttledOnScroll);
onScroll();

// moving text

const textMovingElements = document.querySelectorAll("[data-js-nr-change]");
const movingElementIndexTrack = {};

function moveElements() {
  textMovingElements.forEach((textMovingEl, textMovingElIdx) => {
    const optionsStr = textMovingEl.dataset.jsNrChange.split(",");

    if (movingElementIndexTrack[textMovingElIdx] !== undefined) {
      movingElementIndexTrack[textMovingElIdx] =
        (movingElementIndexTrack[textMovingElIdx] + 1) % optionsStr.length;
    } else {
      movingElementIndexTrack[textMovingElIdx] = 0;
    }

    const currentIdx = movingElementIndexTrack[textMovingElIdx];

    textMovingEl.querySelector("[data-js-nr-change-message]").innerHTML =
      optionsStr[currentIdx];
    textMovingEl.querySelector("[data-js-nr-change-message-next]").innerHTML =
      optionsStr[(currentIdx + 1) % optionsStr.length];

    const width = textMovingEl
      .querySelector("[data-js-nr-change-message]")
      .getBoundingClientRect().width;
    textMovingEl.style.width = width + "px";
  });
}
moveElements();

window.setInterval(moveElements, 5 * 1000);

!(function(name, path, ctx) {
  var latest,
    prev = name !== "Keen" && window.Keen ? window.Keen : false;
  ctx[name] = ctx[name] || {
    ready: function(fn) {
      var h = document.getElementsByTagName("head")[0],
        s = document.createElement("script"),
        w = window,
        loaded;
      s.onload = s.onerror = s.onreadystatechange = function() {
        if ((s.readyState && !/^c|loade/.test(s.readyState)) || loaded) {
          return;
        }
        s.onload = s.onreadystatechange = null;
        loaded = 1;
        latest = w.Keen;
        if (prev) {
          w.Keen = prev;
        } else {
          try {
            delete w.Keen;
          } catch (e) {
            w.Keen = void 0;
          }
        }
        ctx[name] = latest;
        ctx[name].ready(fn);
      };
      s.async = 1;
      s.src = path;
      h.parentNode.insertBefore(s, h);
    }
  };
})(
  "KeenAsync",
  "https://d26b395fwzu5fz.cloudfront.net/keen-tracking-1.4.2.min.js",
  this
);

KeenAsync.ready(function() {
  // Configure a client instance
  var client = new KeenAsync({
    projectId: "5b667619c9e77c0001eefc3f",
    writeKey:
      "E6C53A1E722717F4702758919A2405DD4BCC0930C78D6869324A7E11C727EF1B3B23618DE3C3E6854BB434C93BF3A45FEE8A1D8D286BB758488F28007E2326DB69E18B09B0BA14CA6F5E527C706C6F529FBFFF518E9B881916FC5FAF5C9A8170"
  });

  // Record an event
  client.recordEvent("pageviews", {
    title: document.title
  });

  document.querySelector("[data-js-form-no-js]").classList.add("-hide");
  document.querySelector("[data-js-send-email]").classList.remove("-hide");

  document
    .querySelector("[data-js-send-email]")
    .addEventListener("submit", function(evt) {
      evt.preventDefault();

      const mail = document.querySelector("[data-js-form-mail]").value;
      const message = document.querySelector("[data-js-form-message]").value;

      document
        .querySelector("[data-js-form-success]")
        .classList.remove("-hide");
      document.querySelector("[data-js-send-email]").classList.add("-hide");

      client.recordEvent("email", {
        mail,
        message
      });
    });
});
