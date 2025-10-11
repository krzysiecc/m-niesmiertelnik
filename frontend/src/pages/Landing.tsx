
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Landing() {
  
  const primaryBtnClasses = "w-full sm:w-auto text-center px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover rounded-lg text-text-inverted font-semibold shadow-[0_5px_20px_var(--shadow-color)] transition-all duration-300 transform hover:scale-105";
  const secondaryBtnClasses = "w-full sm:w-auto text-center px-8 py-4 bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-inverted rounded-lg font-semibold transition-all duration-300 transform hover:scale-105";

  const lines = [
    "cyfrowy nieśmiertelnik gwarantujący",
    "błyskawiczny dostęp",
    "do Twoich danych medycznych w nagłych wypadkach",
  ];
  const emphasizedWords = ['nieśmiertelnik', 'dostęp', 'Twoich', 'medycznych', 'nagłych'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger each WORD
        delayChildren: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen bg-background-primary text-text-primary font-roboto flex flex-col">
      {/* The Header component is now part of the Dashboard layout, so it won't show here. This is correct. */}
      
      {/* HERO */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-20 pb-20 bg-gradient-to-b from-background-primary to-background-secondary">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-4 text-text-primary leading-tight"
          variants={{
            visible: { transition: { staggerChildren: 0.3 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {/* We define variants for each word right here */}
          <motion.span className="inline-block" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
            skanujesz
          </motion.span>
          <motion.span className="inline-block mx-2 md:mx-4 font-light" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
            =
          </motion.span>
          <motion.span 
            className="inline-block text-accent-primary" // The key word gets the accent color
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.5 }}
          >
            ratujesz
          </motion.span>
        </motion.h1>
        
        <motion.div
          className="w-full max-w-4xl mb-12 text-center text-xl md:text-2xl font-medium leading-relaxed md:leading-loose"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="block"> {/* Each line is a simple div */}
              {line.split(" ").map((word, wordIndex) => {
                const isEmphasized = emphasizedWords.includes(word.replace(/[.,]/g, ''));
                return (
                  <motion.span
                    key={wordIndex}
                    variants={wordVariants}
                    className={`inline-block ${
                      isEmphasized
                        ? 'text-highlight' // Emphasized with blue color
                        : 'text-text-primary'    // Normal text color
                    }`}
                  >
                    {word}&nbsp; {/* Add a non-breaking space */}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/register" className={primaryBtnClasses}>
            Rejestracja
          </Link>
          <Link to="/login" className={secondaryBtnClasses}>
            Zaloguj się
          </Link>
        </motion.div>
      </section>

      <section className="py-12 bg-background-secondary flex flex-col items-center text-center px-6">
        <h2 className="text-4xl font-semibold mb-12 text-text-primary">Jak to działa?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
          {[
            { title: "1. Stwórz swój profil osobowy", desc: "Wprowadź wszelkie informacje, które chcesz udostępnić w nagłym wypadku." },
            { title: "2. Odbier identyfikator QR", desc: "Wygeneruj unikalny kod QR na telefon lub połącz z opaską NFC." },
            { title: "3. Dziel się Pewnie", desc: "W trudnej sytuacji każdy może zeskanować kod, by natychmiast zobaczyć Twoją kartę informacyjną." },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="bg-background-tertiary rounded-xl p-8 shadow-lg border border-border-primary hover:border-border-hover transition-all transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-text-primary">{step.title}</h3>
              <p className="text-text-secondary text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="py-20 bg-background-primary text-center px-6">
        <h2 className="text-4xl font-semibold mb-4 text-text-primary">
          Spokój ducha w Twojej kieszeni.
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-8">
          Gotów, by stworzyć swoją cyfrową siatkę bezpieczeństwa? Rozpoczęcie jest darmowe.
        </p>
        {/* === REPEATED TWO-BUTTON CTA BLOCK FOR CONSISTENCY === */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className={primaryBtnClasses}>
            Dołącz teraz
          </Link>
          <Link to="/login" className={secondaryBtnClasses}>
            Zaloguj się
          </Link>
        </div>
      </section>

      {/* === NEW FOOTER SECTION === */}
      <footer className="bg-background-secondary border-t border-border-primary text-center py-6 px-6">
        <div className="container mx-auto">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} ComfortApp. Wszelkie prawa zastrzeżone.
          </p>
          <div className="mt-4 flex justify-center gap-x-6 gap-y-2 flex-wrap">
            <Link to="/terms" className="text-xs text-text-secondary hover:text-text-primary transition">
              Warunki użytkowania
            </Link>
            <Link to="/privacy" className="text-xs text-text-secondary hover:text-text-primary transition">
              Polityka Prywatności
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}