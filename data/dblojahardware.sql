-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/05/2023 às 00:09
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `dblojahardware`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbfabricantes`
--

CREATE TABLE `tbfabricantes` (
  `nome` varchar(100) NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbfabricantes`
--

INSERT INTO `tbfabricantes` (`nome`, `endereco`, `telefone`) VALUES
('AMD', 'Endereco2', '22-2222-2222'),
('ASUS', 'Endereco1', '11-1111-1111'),
('DEEPCOOL', 'Endereco8', '88-8888-8888'),
('INTEL', 'Endereco3', '33-3333-3333'),
('LOGITECH', 'Endereco6', '66-6666-6666'),
('NVIDIA', 'Endereco4', '44-4444-4444'),
('NZXT', 'Endereco7', '77-7777-7777'),
('RAZER', 'Endereco5', '55-5555-5555');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbprodutos`
--

CREATE TABLE `tbprodutos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `preço` decimal(10,2) NOT NULL,
  `descrição` text DEFAULT NULL,
  `quantidade_estoque` int(11) NOT NULL,
  `fabricante` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbprodutos`
--

INSERT INTO `tbprodutos` (`id`, `nome`, `preço`, `descrição`, `quantidade_estoque`, `fabricante`) VALUES
(1, 'AMD Ryzen 5 5600X', 719.99, 'RYZEN 5 5600X, 6-CORE, 12-THREADS, 3.7GHZ (4.6GHZ TURBO), CACHE 35MB, AM4', 57, 'AMD'),
(2, 'AMD Ryzen 5 5600G', 669.99, 'RYZEN 5 5600G, 6-CORE, 12-THREADS, 3.9GHZ (4.4GHZ TURBO), CACHE 19MB, AM4', 35, 'AMD'),
(3, 'INTEL CORE I5-11400F', 799.99, 'INTEL CORE I5-11400F, 6-CORE, 12-THREADS, 2.6GHZ (4.4GHZ TURBO), CACHE 12MB, LGA1200', 78, 'INTEL'),
(4, 'ASUS TUF GAMING B550M-PLUS', 620.00, 'SOCKET AM4 CHIPSET AMD B550, Micro ATX, PCIe 4.0 M.2', 43, 'ASUS'),
(5, 'Fonte NZXT C550', 344.99, 'C550 Bronze, 550W, 80 Plus Bronze, PFC Ativo, Semi Modular', 38, 'NZXT'),
(6, 'DeepCool High Performance AK400', 149.99, 'Cooler para processador 120mm', 59, 'DEEPCOOL'),
(7, 'MOUSE RAZER DEATHADDER', 269.99, 'DEATHADDER V2 CHROMA 20000 DPI', 140, 'RAZER');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbusuarios`
--

CREATE TABLE `tbusuarios` (
  `codigo` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbusuarios`
--

INSERT INTO `tbusuarios` (`codigo`, `nome`, `email`, `senha`) VALUES
(1, 'Kelvin Marques', 'kelvin@ifrn.edu.br', '7777'),
(2, 'Andriéria Dantas', 'andrieria@ifrn.edu.br', '2525'),
(3, 'Guilherme Aurélio', 'guilherme@ifrn.edu.br', '8888'),
(4, 'Marcelo Varela', 'marcelo@ifrn.edu.br', '1234');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tbfabricantes`
--
ALTER TABLE `tbfabricantes`
  ADD PRIMARY KEY (`nome`);

--
-- Índices de tabela `tbprodutos`
--
ALTER TABLE `tbprodutos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fabricante` (`fabricante`);

--
-- Índices de tabela `tbusuarios`
--
ALTER TABLE `tbusuarios`
  ADD PRIMARY KEY (`codigo`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tbprodutos`
--
ALTER TABLE `tbprodutos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `tbusuarios`
--
ALTER TABLE `tbusuarios`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tbprodutos`
--
ALTER TABLE `tbprodutos`
  ADD CONSTRAINT `tbprodutos_ibfk_1` FOREIGN KEY (`fabricante`) REFERENCES `tbfabricantes` (`nome`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
