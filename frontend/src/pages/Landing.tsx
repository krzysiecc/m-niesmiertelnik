import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUserEdit, FaQrcode, FaShieldAlt } from 'react-icons/fa';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function Landing() {
  const { t } = useTranslation();

  // Button style definitions
  const primaryBtnClasses = "w-full sm:w-auto text-center px-8 py-4 bg-accent-primary hover:bg-accent-primary-hover rounded-lg text-on-accent font-semibold shadow-[0_5px_20px_var(--shadow-color)] transition-all duration-300 transform hover:scale-105";
  const secondaryBtnClasses = "w-full sm:w-auto text-center px-8 py-4 bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-text-inverted rounded-lg font-semibold transition-all duration-300 transform hover:scale-105";

  // Localized, word-animated text content.
  const sloganWords = t("landing.sloganWords", { returnObjects: true }) as string[];
  const sloganHighlight = t("landing.sloganHighlight");
  const subheadlineLines = t("landing.subheadlineLines", { returnObjects: true }) as string[];
  const emphasizedWords = t("landing.emphasizedWords", { returnObjects: true }) as string[];
  const stepIcons = [<FaUserEdit />, <FaQrcode />, <FaShieldAlt />];
  const steps = t("landing.steps", { returnObjects: true }) as { title: string; desc: string }[];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

      <motion.div
        className="fixed top-6 right-6 z-50 flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <LanguageSwitcher />
        <ThemeSwitcher />
      </motion.div>

      {/* HERO */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-20 pb-20 bg-gradient-to-b from-background-primary to-background-secondary">

        <motion.div
          className="flex items-center gap-x-4 mb-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
          <img
            src="/logo.png"
            alt="mNieśmiertelnik Logo"
            className="h-20 md:h-30"
          />
          <h2 className="font-semibold text-2xl md:text-5xl text-text-primary">
            <span className="text-accent-primary">m</span>Nieśmiertelnik
          </h2>
        </motion.div>

        {/* Headline / slogan */}
        <motion.h1 className="text-5xl md:text-7xl font-bold mb-4 text-text-primary leading-tight flex gap-x-2 md:gap-x-4" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }} initial="hidden" animate="visible">
          {sloganWords.map((word, index) => (
            <div key={index} style={{ overflow: 'hidden' }}>
              <motion.span
                className={`inline-block transition-colors duration-300 ${word === sloganHighlight ? 'text-accent-primary' : ''}`}
                variants={{ hidden: { y: "100%", opacity: 0 }, visible: { y: "0%", opacity: 1 } }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </motion.h1>

        {/* Sub-headline */}
        <motion.div
          className="w-full max-w-4xl mb-12 text-center text-xl md:text-2xl font-semibold leading-relaxed md:leading-loose"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subheadlineLines.map((line, lineIndex) => (
            <div key={lineIndex} className="block">
              {line.split(" ").map((word, wordIndex) => {
                const isEmphasized = emphasizedWords.includes(word.replace(/[.,]/g, ''));
                return (
                  <motion.span
                    key={wordIndex}
                    variants={wordVariants as never}
                    className={`inline-block ${
                      isEmphasized
                        ? 'text-text-secondary font-extrabold'
                        : 'text-text-primary'
                    }`}
                  >
                    {word}&nbsp;
                  </motion.span>
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="flex flex-col sm:flex-row items-center gap-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Link to="/register" className={primaryBtnClasses}>{t('landing.register')}</Link>
          <Link to="/login" className={secondaryBtnClasses}>{t('landing.login')}</Link>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pt-1 pb-16 bg-background-secondary flex flex-col items-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-semibold mb-12 text-text-primary">{t('landing.howItWorks')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="bg-background-tertiary rounded-xl p-8 shadow-lg border border-border-primary hover:border-border-hover transition-all transform hover:-translate-y-2 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="text-5xl text-accent-primary mb-6">{stepIcons[i]}</div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">{step.title}</h3>
              <p className="text-text-secondary text-base">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BOTTOM & FOOTER */}
      <section className="py-20 bg-background-primary text-center px-6">
        <h2 className="text-4xl font-semibold mb-4 text-text-primary">{t('landing.epuapHeadline')}</h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-8">{t('landing.freeUsage')} <br /> {t('landing.freeUsageNfc')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className={primaryBtnClasses}>{t('landing.joinNow')}</Link>
          <Link to="/login" className={secondaryBtnClasses}>{t('landing.login')}</Link>
        </div>
      </section>
      <footer className="bg-background-secondary border-t border-border-primary text-center py-6 px-6">
        <div className="container mx-auto">
          <p className="text-sm text-text-secondary">© {new Date().getFullYear()} mNieśmiertelnik. {t('landing.rightsReserved')}</p>
          <div className="mt-4 flex justify-center gap-x-6 gap-y-2 flex-wrap">
            <Link to="/terms" className="text-xs text-text-secondary hover:text-text-primary transition">{t('landing.terms')}</Link>
            <Link to="/privacy" className="text-xs text-text-secondary hover:text-text-primary transition">{t('landing.privacy')}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
