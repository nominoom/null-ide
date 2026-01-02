import React from 'react';
import styles from './Modal.module.css';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>About Null IDE</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.aboutContent}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <h1>Null IDE</h1>
              <p className={styles.version}>Version 1.0.0</p>
            </div>

            <div className={styles.branding}>
              <p className={styles.tagline}>The Ultimate Hacker & Master Programmer IDE</p>
              <p className={styles.subtitle}>Created by <strong>NullSec</strong> — A Hacker's Foundation</p>
            </div>

            <div className={styles.description}>
              <p>
                Null IDE is a privacy-focused, high-performance integrated development environment
                designed for hackers, security researchers, and master programmers. It combines
                powerful tools, a clean hacker aesthetic, and local-first privacy principles.
              </p>
            </div>

            <div className={styles.features}>
              <h3>✨ Features</h3>
              <ul>
                <li>🎨 Monaco Editor with advanced syntax highlighting</li>
                <li>🔐 100+ hacking and security utilities</li>
                <li>🛠️ 1000+ programmer tools and transformations</li>
                <li>🤖 Integrated DeepHat AI assistant</li>
                <li>🔒 Local-only data storage (no cloud, no telemetry)</li>
                <li>⚡ Fast, lightweight, and fully customizable</li>
                <li>🌐 Cross-platform (Windows, macOS, Linux)</li>
              </ul>
            </div>

            <div className={styles.tech}>
              <h3>🔧 Built With</h3>
              <ul>
                <li>Electron - Desktop application framework</li>
                <li>React - User interface library</li>
                <li>TypeScript - Type-safe development</li>
                <li>Monaco Editor - VS Code's editor core</li>
              </ul>
            </div>

            <div className={styles.privacy}>
              <h3>🔒 Privacy Commitment</h3>
              <p>
                <strong>Your code never leaves your machine.</strong> Null IDE is built with
                privacy as a core principle. All settings, files, and data are stored locally.
                No user tracking, no analytics, no telemetry.
              </p>
            </div>

            <div className={styles.disclaimer}>
              <p>
                <strong>Disclaimer:</strong> Null IDE's hacking tools are provided for educational
                and authorized security testing purposes only. Users are responsible for ensuring
                all usage complies with applicable laws and regulations.
              </p>
            </div>

            <div className={styles.copyright}>
              <p>© 2026 NullSec. All rights reserved.</p>
              <p className="text-secondary">
                Made with ❤️ by hackers, for hackers.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnPrimary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
