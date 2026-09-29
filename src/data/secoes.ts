export interface Secao {
  sigla: string
  nome: string
  grupo?: string
  // Cores da bandeira, só para decoração: nunca atrás de texto (design-system.md).
  cores: string[]
}

export const SECOES: Secao[] = [
  { sigla: '00', nome: 'Abertura', cores: ['#1F2A44', '#C9A227'] },
  { sigla: 'FWC', nome: 'Copa do Mundo', cores: ['#1F2A44', '#C9A227'] },

  { sigla: 'MEX', nome: 'México', grupo: 'A', cores: ['#006847', '#FFFFFF', '#CE1126'] },
  { sigla: 'RSA', nome: 'África do Sul', grupo: 'A', cores: ['#007A4D', '#FFB612', '#DE3831'] },
  { sigla: 'KOR', nome: 'Coreia do Sul', grupo: 'A', cores: ['#C60C30', '#003478', '#FFFFFF'] },
  { sigla: 'CZE', nome: 'Tchéquia', grupo: 'A', cores: ['#11457E', '#FFFFFF', '#D7141A'] },

  { sigla: 'CAN', nome: 'Canadá', grupo: 'B', cores: ['#D80621', '#FFFFFF'] },
  { sigla: 'BIH', nome: 'Bósnia e Herzegovina', grupo: 'B', cores: ['#002395', '#FECB00'] },
  { sigla: 'QAT', nome: 'Catar', grupo: 'B', cores: ['#8A1538', '#FFFFFF'] },
  { sigla: 'SUI', nome: 'Suíça', grupo: 'B', cores: ['#DA291C', '#FFFFFF'] },

  { sigla: 'BRA', nome: 'Brasil', grupo: 'C', cores: ['#009C3B', '#FFDF00', '#002776'] },
  { sigla: 'MAR', nome: 'Marrocos', grupo: 'C', cores: ['#C1272D', '#006233'] },
  { sigla: 'HAI', nome: 'Haiti', grupo: 'C', cores: ['#00209F', '#D21034'] },
  { sigla: 'SCO', nome: 'Escócia', grupo: 'C', cores: ['#005EB8', '#FFFFFF'] },

  { sigla: 'USA', nome: 'Estados Unidos', grupo: 'D', cores: ['#0A3161', '#FFFFFF', '#B31942'] },
  { sigla: 'PAR', nome: 'Paraguai', grupo: 'D', cores: ['#D52B1E', '#FFFFFF', '#0038A8'] },
  { sigla: 'AUS', nome: 'Austrália', grupo: 'D', cores: ['#012169', '#FFFFFF', '#E4002B'] },
  { sigla: 'TUR', nome: 'Turquia', grupo: 'D', cores: ['#E30A17', '#FFFFFF'] },

  { sigla: 'GER', nome: 'Alemanha', grupo: 'E', cores: ['#000000', '#DD0000', '#FFCE00'] },
  { sigla: 'CUW', nome: 'Curaçao', grupo: 'E', cores: ['#002B7F', '#F9E814'] },
  { sigla: 'CIV', nome: 'Costa do Marfim', grupo: 'E', cores: ['#F77F00', '#FFFFFF', '#009E60'] },
  { sigla: 'ECU', nome: 'Equador', grupo: 'E', cores: ['#FFDD00', '#034EA2', '#ED1C24'] },

  { sigla: 'NED', nome: 'Holanda', grupo: 'F', cores: ['#AE1C28', '#FFFFFF', '#21468B'] },
  { sigla: 'JPN', nome: 'Japão', grupo: 'F', cores: ['#BC002D', '#FFFFFF'] },
  { sigla: 'SWE', nome: 'Suécia', grupo: 'F', cores: ['#006AA7', '#FECC00'] },
  { sigla: 'TUN', nome: 'Tunísia', grupo: 'F', cores: ['#E70013', '#FFFFFF'] },

  { sigla: 'BEL', nome: 'Bélgica', grupo: 'G', cores: ['#000000', '#FAE042', '#ED2939'] },
  { sigla: 'EGY', nome: 'Egito', grupo: 'G', cores: ['#CE1126', '#FFFFFF', '#000000'] },
  { sigla: 'IRN', nome: 'Irã', grupo: 'G', cores: ['#239F40', '#FFFFFF', '#DA0000'] },
  { sigla: 'NZL', nome: 'Nova Zelândia', grupo: 'G', cores: ['#00247D', '#FFFFFF', '#CC142B'] },

  { sigla: 'ESP', nome: 'Espanha', grupo: 'H', cores: ['#AA151B', '#F1BF00'] },
  { sigla: 'CPV', nome: 'Cabo Verde', grupo: 'H', cores: ['#003893', '#FFFFFF', '#CF2027', '#F7D116'] },
  { sigla: 'KSA', nome: 'Arábia Saudita', grupo: 'H', cores: ['#006C35', '#FFFFFF'] },
  { sigla: 'URU', nome: 'Uruguai', grupo: 'H', cores: ['#0038A8', '#FFFFFF', '#FCD116'] },

  { sigla: 'FRA', nome: 'França', grupo: 'I', cores: ['#002395', '#FFFFFF', '#ED2939'] },
  { sigla: 'SEN', nome: 'Senegal', grupo: 'I', cores: ['#00853F', '#FDEF42', '#E31B23'] },
  { sigla: 'IRQ', nome: 'Iraque', grupo: 'I', cores: ['#CE1126', '#FFFFFF', '#000000', '#007A3D'] },
  { sigla: 'NOR', nome: 'Noruega', grupo: 'I', cores: ['#BA0C2F', '#FFFFFF', '#00205B'] },

  { sigla: 'ARG', nome: 'Argentina', grupo: 'J', cores: ['#74ACDF', '#FFFFFF', '#F6B40E'] },
  { sigla: 'ALG', nome: 'Argélia', grupo: 'J', cores: ['#006233', '#FFFFFF', '#D21034'] },
  { sigla: 'AUT', nome: 'Áustria', grupo: 'J', cores: ['#C8102E', '#FFFFFF'] },
  { sigla: 'JOR', nome: 'Jordânia', grupo: 'J', cores: ['#000000', '#FFFFFF', '#007A3D', '#CE1126'] },

  { sigla: 'POR', nome: 'Portugal', grupo: 'K', cores: ['#046A38', '#DA291C', '#FFE900'] },
  { sigla: 'COD', nome: 'RD Congo', grupo: 'K', cores: ['#007FFF', '#F7D618', '#CE1021'] },
  { sigla: 'UZB', nome: 'Uzbequistão', grupo: 'K', cores: ['#0099B5', '#FFFFFF', '#1EB53A'] },
  { sigla: 'COL', nome: 'Colômbia', grupo: 'K', cores: ['#FCD116', '#003893', '#CE1126'] },

  { sigla: 'ENG', nome: 'Inglaterra', grupo: 'L', cores: ['#CE1124', '#FFFFFF'] },
  { sigla: 'CRO', nome: 'Croácia', grupo: 'L', cores: ['#FF0000', '#FFFFFF', '#171796'] },
  { sigla: 'GHA', nome: 'Gana', grupo: 'L', cores: ['#CE1126', '#FCD116', '#006B3F'] },
  { sigla: 'PAN', nome: 'Panamá', grupo: 'L', cores: ['#D21034', '#FFFFFF', '#005293'] },
]
