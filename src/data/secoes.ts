export interface Secao {
  sigla: string
  nome: string
  grupo?: string
  // Nome do arquivo em src/assets/bandeiras (código ISO do flag-icons).
  bandeira?: string
  // Cores da bandeira, só para decoração: nunca atrás de texto (design-system.md).
  cores: string[]
}

export const SECOES: Secao[] = [
  { sigla: '00', nome: 'Abertura', cores: ['#4A6FA5', '#C9A227'] },
  { sigla: 'FWC', nome: 'Copa do Mundo', cores: ['#4A6FA5', '#C9A227'] },

  { sigla: 'MEX', nome: 'México', grupo: 'A', bandeira: 'mx', cores: ['#006847', '#FFFFFF', '#CE1126'] },
  { sigla: 'RSA', nome: 'África do Sul', grupo: 'A', bandeira: 'za', cores: ['#007A4D', '#FFB612', '#DE3831'] },
  { sigla: 'KOR', nome: 'Coreia do Sul', grupo: 'A', bandeira: 'kr', cores: ['#C60C30', '#003478', '#FFFFFF'] },
  { sigla: 'CZE', nome: 'Tchéquia', grupo: 'A', bandeira: 'cz', cores: ['#11457E', '#FFFFFF', '#D7141A'] },

  { sigla: 'CAN', nome: 'Canadá', grupo: 'B', bandeira: 'ca', cores: ['#D80621', '#FFFFFF'] },
  { sigla: 'BIH', nome: 'Bósnia e Herzegovina', grupo: 'B', bandeira: 'ba', cores: ['#002395', '#FECB00'] },
  { sigla: 'QAT', nome: 'Catar', grupo: 'B', bandeira: 'qa', cores: ['#8A1538', '#FFFFFF'] },
  { sigla: 'SUI', nome: 'Suíça', grupo: 'B', bandeira: 'ch', cores: ['#DA291C', '#FFFFFF'] },

  { sigla: 'BRA', nome: 'Brasil', grupo: 'C', bandeira: 'br', cores: ['#009C3B', '#FFDF00', '#002776'] },
  { sigla: 'MAR', nome: 'Marrocos', grupo: 'C', bandeira: 'ma', cores: ['#C1272D', '#006233'] },
  { sigla: 'HAI', nome: 'Haiti', grupo: 'C', bandeira: 'ht', cores: ['#00209F', '#D21034'] },
  { sigla: 'SCO', nome: 'Escócia', grupo: 'C', bandeira: 'gb-sct', cores: ['#005EB8', '#FFFFFF'] },

  { sigla: 'USA', nome: 'Estados Unidos', grupo: 'D', bandeira: 'us', cores: ['#0A3161', '#FFFFFF', '#B31942'] },
  { sigla: 'PAR', nome: 'Paraguai', grupo: 'D', bandeira: 'py', cores: ['#D52B1E', '#FFFFFF', '#0038A8'] },
  { sigla: 'AUS', nome: 'Austrália', grupo: 'D', bandeira: 'au', cores: ['#012169', '#FFFFFF', '#E4002B'] },
  { sigla: 'TUR', nome: 'Turquia', grupo: 'D', bandeira: 'tr', cores: ['#E30A17', '#FFFFFF'] },

  { sigla: 'GER', nome: 'Alemanha', grupo: 'E', bandeira: 'de', cores: ['#000000', '#DD0000', '#FFCE00'] },
  { sigla: 'CUW', nome: 'Curaçao', grupo: 'E', bandeira: 'cw', cores: ['#002B7F', '#F9E814'] },
  { sigla: 'CIV', nome: 'Costa do Marfim', grupo: 'E', bandeira: 'ci', cores: ['#F77F00', '#FFFFFF', '#009E60'] },
  { sigla: 'ECU', nome: 'Equador', grupo: 'E', bandeira: 'ec', cores: ['#FFDD00', '#034EA2', '#ED1C24'] },

  { sigla: 'NED', nome: 'Holanda', grupo: 'F', bandeira: 'nl', cores: ['#AE1C28', '#FFFFFF', '#21468B'] },
  { sigla: 'JPN', nome: 'Japão', grupo: 'F', bandeira: 'jp', cores: ['#BC002D', '#FFFFFF'] },
  { sigla: 'SWE', nome: 'Suécia', grupo: 'F', bandeira: 'se', cores: ['#006AA7', '#FECC00'] },
  { sigla: 'TUN', nome: 'Tunísia', grupo: 'F', bandeira: 'tn', cores: ['#E70013', '#FFFFFF'] },

  { sigla: 'BEL', nome: 'Bélgica', grupo: 'G', bandeira: 'be', cores: ['#000000', '#FAE042', '#ED2939'] },
  { sigla: 'EGY', nome: 'Egito', grupo: 'G', bandeira: 'eg', cores: ['#CE1126', '#FFFFFF', '#000000'] },
  { sigla: 'IRN', nome: 'Irã', grupo: 'G', bandeira: 'ir', cores: ['#239F40', '#FFFFFF', '#DA0000'] },
  { sigla: 'NZL', nome: 'Nova Zelândia', grupo: 'G', bandeira: 'nz', cores: ['#00247D', '#FFFFFF', '#CC142B'] },

  { sigla: 'ESP', nome: 'Espanha', grupo: 'H', bandeira: 'es', cores: ['#AA151B', '#F1BF00'] },
  { sigla: 'CPV', nome: 'Cabo Verde', grupo: 'H', bandeira: 'cv', cores: ['#003893', '#FFFFFF', '#CF2027', '#F7D116'] },
  { sigla: 'KSA', nome: 'Arábia Saudita', grupo: 'H', bandeira: 'sa', cores: ['#006C35', '#FFFFFF'] },
  { sigla: 'URU', nome: 'Uruguai', grupo: 'H', bandeira: 'uy', cores: ['#0038A8', '#FFFFFF', '#FCD116'] },

  { sigla: 'FRA', nome: 'França', grupo: 'I', bandeira: 'fr', cores: ['#002395', '#FFFFFF', '#ED2939'] },
  { sigla: 'SEN', nome: 'Senegal', grupo: 'I', bandeira: 'sn', cores: ['#00853F', '#FDEF42', '#E31B23'] },
  { sigla: 'IRQ', nome: 'Iraque', grupo: 'I', bandeira: 'iq', cores: ['#CE1126', '#FFFFFF', '#000000', '#007A3D'] },
  { sigla: 'NOR', nome: 'Noruega', grupo: 'I', bandeira: 'no', cores: ['#BA0C2F', '#FFFFFF', '#00205B'] },

  { sigla: 'ARG', nome: 'Argentina', grupo: 'J', bandeira: 'ar', cores: ['#74ACDF', '#FFFFFF', '#F6B40E'] },
  { sigla: 'ALG', nome: 'Argélia', grupo: 'J', bandeira: 'dz', cores: ['#006233', '#FFFFFF', '#D21034'] },
  { sigla: 'AUT', nome: 'Áustria', grupo: 'J', bandeira: 'at', cores: ['#C8102E', '#FFFFFF'] },
  { sigla: 'JOR', nome: 'Jordânia', grupo: 'J', bandeira: 'jo', cores: ['#000000', '#FFFFFF', '#007A3D', '#CE1126'] },

  { sigla: 'POR', nome: 'Portugal', grupo: 'K', bandeira: 'pt', cores: ['#046A38', '#DA291C', '#FFE900'] },
  { sigla: 'COD', nome: 'RD Congo', grupo: 'K', bandeira: 'cd', cores: ['#007FFF', '#F7D618', '#CE1021'] },
  { sigla: 'UZB', nome: 'Uzbequistão', grupo: 'K', bandeira: 'uz', cores: ['#0099B5', '#FFFFFF', '#1EB53A'] },
  { sigla: 'COL', nome: 'Colômbia', grupo: 'K', bandeira: 'co', cores: ['#FCD116', '#003893', '#CE1126'] },

  { sigla: 'ENG', nome: 'Inglaterra', grupo: 'L', bandeira: 'gb-eng', cores: ['#CE1124', '#FFFFFF'] },
  { sigla: 'CRO', nome: 'Croácia', grupo: 'L', bandeira: 'hr', cores: ['#FF0000', '#FFFFFF', '#171796'] },
  { sigla: 'GHA', nome: 'Gana', grupo: 'L', bandeira: 'gh', cores: ['#CE1126', '#FCD116', '#006B3F'] },
  { sigla: 'PAN', nome: 'Panamá', grupo: 'L', bandeira: 'pa', cores: ['#D21034', '#FFFFFF', '#005293'] },
]
