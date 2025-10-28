import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-cols-3">
          <div>
            <h3>JobPortal</h3>
            <p>La plateforme de recrutement qui connecte les talents aux opportunités.</p>
          </div>

          <div>
            <h4>Liens utiles</h4>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li style={{marginBottom: '0.5rem'}}>
                <a href="#" style={{color: '#d1d5db'}}>À propos</a>
              </li>
              <li style={{marginBottom: '0.5rem'}}>
                <a href="#" style={{color: '#d1d5db'}}>Contact</a>
              </li>
              <li style={{marginBottom: '0.5rem'}}>
                <a href="#" style={{color: '#d1d5db'}}>Politique de confidentialité</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Suivez-nous</h4>
            <div style={{display: 'flex', gap: '1rem'}}>
              <a href="#" style={{color: '#d1d5db'}}>LinkedIn</a>
              <a href="#" style={{color: '#d1d5db'}}>Twitter</a>
              <a href="#" style={{color: '#d1d5db'}}>Facebook</a>
            </div>
          </div>
        </div>

        <div className="copyright">
          <p>© 2024 JobPortal. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;