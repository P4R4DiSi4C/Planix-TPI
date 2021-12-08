-- phpMyAdmin SQL Dump
-- version 4.7.8
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le :  jeu. 07 juin 2018 à 08:19
-- Version du serveur :  10.2.15-MariaDB-10.2.15+maria~xenial-log
-- Version de PHP :  7.1.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `planix_prod`
--
CREATE DATABASE IF NOT EXISTS `planix_prod` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `planix_prod`;

-- --------------------------------------------------------

--
-- Structure de la table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id_event` varchar(255) NOT NULL,
  `evt_desc` varchar(60) NOT NULL,
  `evt_place` varchar(50) NOT NULL,
  `evt_discretion` tinyint(1) NOT NULL,
  `evt_reply_type` tinyint(1) NOT NULL,
  `fk_usr_creator` varchar(255) NOT NULL,
  PRIMARY KEY (`id_event`),
  KEY `fk_usr_creator_to_user` (`fk_usr_creator`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `events_dates`
--

CREATE TABLE IF NOT EXISTS `events_dates` (
  `id_date` int(11) NOT NULL AUTO_INCREMENT,
  `evt_date` datetime NOT NULL,
  `fk_evt` varchar(255) NOT NULL,
  PRIMARY KEY (`id_date`),
  KEY `fk_evt_date_to_event` (`fk_evt`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `participations`
--

CREATE TABLE IF NOT EXISTS `participations` (
  `id_participation` int(11) NOT NULL AUTO_INCREMENT,
  `par_probability` int(11) DEFAULT NULL,
  `par_reply` enum('Oui','Ok si majorité','Peut-être','Non') DEFAULT NULL,
  `fk_usr` varchar(255) NOT NULL,
  `fk_evt` varchar(255) NOT NULL,
  `fk_date` int(11) NOT NULL,
  PRIMARY KEY (`id_participation`),
  KEY `fk_date_to_date` (`fk_date`),
  KEY `fk_usr_to_user` (`fk_usr`),
  KEY `fk_event_to_event` (`fk_evt`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_user` varchar(255) NOT NULL,
  `usr_firstname` varchar(30) DEFAULT NULL,
  `usr_lastname` varchar(30) DEFAULT NULL,
  `usr_email` varchar(60) DEFAULT NULL,
  `usr_phone` varchar(20) DEFAULT NULL,
  `usr_access_token` varchar(255) DEFAULT NULL,
  `usr_refresh_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_usr_creator_to_user` FOREIGN KEY (`fk_usr_creator`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `events_dates`
--
ALTER TABLE `events_dates`
  ADD CONSTRAINT `fk_evt_date_to_event` FOREIGN KEY (`fk_evt`) REFERENCES `events` (`id_event`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `participations`
--
ALTER TABLE `participations`
  ADD CONSTRAINT `fk_date_to_date` FOREIGN KEY (`fk_date`) REFERENCES `events_dates` (`id_date`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_event_to_event` FOREIGN KEY (`fk_evt`) REFERENCES `events` (`id_event`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_usr_to_user` FOREIGN KEY (`fk_usr`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
