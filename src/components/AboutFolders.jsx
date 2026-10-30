"use client";

import FolderFloat from "./FolderFloat";

function preserveScrollPosition() {
  const scrollTop = window.scrollY;

  window.requestAnimationFrame(() => {
    if (Math.abs(window.scrollY - scrollTop) > 1) {
      window.scrollTo({ top: scrollTop, behavior: "instant" });
    }
  });
}

export default function AboutFolders({ hobbies, work }) {
  return (
    <div className="about-hobbies__columns">
      <article className="about-hobbies__column">
        <div className="about-hobbies__copy">
          <p className="about-hobbies__eyebrow">WHAT I DO</p>
          <h2>Build useful digital things.</h2>
          <p>I create web and mobile systems, and I&apos;m open to web development commissions.</p>
        </div>
        <div className="about-hobbies__folder">
          <FolderFloat
            items={work}
            label="What I do"
            sublabel="Build · improve · learn"
            trigger="hover"
            closeOnSelect={false}
            spread={138}
            mobileHint="TAP TO OPEN"
            onOpenChange={preserveScrollPosition}
          />
        </div>
      </article>

      <article className="about-hobbies__column">
        <div className="about-hobbies__copy">
          <p className="about-hobbies__eyebrow">OFF THE KEYBOARD</p>
          <h2 id="about-hobbies-title">My hobbies</h2>
          <p>Open the folder to see some of the things I make time for outside of building projects.</p>
        </div>
        <div className="about-hobbies__folder">
          <FolderFloat
            items={hobbies}
            label="My hobbies"
            sublabel="A little of everything"
            trigger="hover"
            closeOnSelect={false}
            spread={138}
            mobileHint="TAP TO OPEN"
            onOpenChange={preserveScrollPosition}
          />
        </div>
      </article>
    </div>
  );
}
