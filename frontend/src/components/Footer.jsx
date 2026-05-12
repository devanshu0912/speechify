// import React from 'react';

// const TEAM = [
//   { name: 'Devanshu Shukla',     role: 'Frontend Lead' },
//   { name: 'Asif Khan',           role: 'AI/ML Engineer' },
//   { name: 'Dhyan Chandra Singh', role: 'Backend Developer' },
//   { name: 'Nikhil Kumar',        role: 'UI/UX Designer' },
//   { name: 'Manish Kumar',        role: 'Database Engineer' },
// ];

// export default function Footer() {
//   return (
//     <footer className="site-footer">
//       <div className="footer-inner">
//         <div className="footer-top">
//           <div className="footer-brand">
//             <div className="footer-logo">
//               <div className="footer-logo-icon">🧠</div>
//               <span className="footer-logo-name">Speechify</span>
//             </div>
//             <p>
//               AI-Enabled Personalized Reading Assistant for Dyslexia.
//               Final Year Project — transforming reading through artificial intelligence.
//             </p>
//             <div style={{ marginTop: 14, fontSize: 12, color: '#78716c', lineHeight: 2 }}>
//               <div>🎓 Guided by: <strong style={{ color: '#a8a29e' }}>Mr. Neeraj Baishwar</strong></div>
//               <div>👩‍🏫 Faculty: <strong style={{ color: '#a8a29e' }}>Ms. Pratibha Pandey &amp; Ms. Hima Saxena</strong></div>
//             </div>
//           </div>

//           <div className="footer-section">
//             <h5>Tech Stack</h5>
//             <ul>
//               {['React.js (Frontend)','Node.js + Express (Backend)','MongoDB (Database)','Groq Llama AI (Summarizer)','JWT Authentication','Web Speech API (TTS)','Free Dictionary API'].map(f => <li key={f}>{f}</li>)}
//             </ul>
//           </div>

//           <div className="footer-section">
//             <h5>Our Team</h5>
//             <div className="team-list">
//               {TEAM.map(({ name, role }) => (
//                 <div key={name} className="team-member">
//                   <div className="member-dot" />
//                   <div>
//                     <div style={{ fontWeight: 600 }}>{name}</div>
//                     <div style={{ fontSize: 11, color: '#78716c' }}>{role}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <p className="footer-copy">
//             © 2025 <span>Speechify</span>. Final Year Project — AI Reading Assistant for Dyslexia.
//           </p>
//           <div className="footer-badge">🧠 Dyslexia-Friendly Design</div>
//         </div>
//       </div>
//     </footer>
//   );
// }
import React from 'react';

const TEAM = [
  { name: 'Devanshu Shukla' },
  { name: 'Asif Khan' },
  { name: 'Dhyan Chandra Singh' },
  { name: 'Nikhil Kumar' },
  { name: 'Manish Kumar' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">🧠</div>
              <span className="footer-logo-name">Speechify</span>
            </div>

            <p>
              AI-Enabled Personalized Reading Assistant for Dyslexia.
              Final Year Project — transforming reading through artificial intelligence.
            </p>

            <div style={{ marginTop: 14, fontSize: 12, color: '#78716c', lineHeight: 2 }}>
              <div>
                🎓 Guided by:{' '}
                <strong style={{ color: '#a8a29e' }}>
                  Mr. Neeraj Baishwar,
                  Mr.Ritesh Kumar
                </strong>
              </div>

              {/* <div>
                👨‍🏫 Faculty:{' '}
                <strong style={{ color: '#a8a29e' }}>
                  Mr. Ritesh Kumar
                </strong>
              </div>
            </div>
          </div> */}

          <div className="footer-section">
            <h5>Tech Stack</h5>

            <ul>
              {[
                'React.js (Frontend)',
                'Node.js + Express (Backend)',
                'MongoDB (Database)',
                'Groq Llama AI (Summarizer)',
                'JWT Authentication',
                'Web Speech API (TTS)',
                'Free Dictionary API'
              ].map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h5>Our Team</h5>

            <div className="team-list">
              {TEAM.map(({ name }) => (
                <div key={name} className="team-member">
                  <div className="member-dot" />

                  <div>
                    <div style={{ fontWeight: 600 }}>{name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2025 <span>Speechify</span>. Final Year Project — AI Reading Assistant for Dyslexia.
          </p>

          <div className="footer-badge">
            🧠 Dyslexia-Friendly Design
          </div>
        </div>
      </div>
    </footer>
  );
}
