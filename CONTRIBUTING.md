# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o **Meus Medicamentos**! 🎉

Este documento fornece diretrizes e informações sobre como contribuir efetivamente para o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits e Pull Requests](#commits-e-pull-requests)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Funcionalidades](#sugerindo-funcionalidades)

---

## 📜 Código de Conduta

Este projeto segue o [Código de Conduta da Comunidade](CODE_OF_CONDUCT.md). Ao participar, você concorda em seguir estes termos.

### 🌟 Nossos Valores
- **Respeito mútuo** - Trate todos com cortesia e profissionalismo
- **Inclusividade** - Bem-vindos desenvolvedores de todos os níveis
- **Colaboração** - Trabalhe junto para melhorar o projeto
- **Aprendizado** - Compartilhe conhecimento e aprenda com outros

---

## 🛠️ Como Posso Contribuir?

### 🐛 Reportando Bugs
- Use o template de [bug report](.github/ISSUE_TEMPLATE/bug_report.md)
- Inclua passos detalhados para reproduzir
- Adicione screenshots quando relevante
- Especifique o ambiente (OS, browser, versão)

### ✨ Sugerindo Funcionalidades
- Use o template de [feature request](.github/ISSUE_TEMPLATE/feature_request.md)
- Explique o problema que a funcionalidade resolve
- Descreva a solução proposta
- Considere alternativas e impactos

### 💻 Contribuindo com Código
- Corrija bugs existentes
- Implemente novas funcionalidades
- Melhore a documentação
- Adicione ou melhore testes
- Otimize performance

### 📚 Melhorando Documentação
- Corrija erros de ortografia/gramática
- Adicione exemplos de uso
- Melhore explicações técnicas
- Traduza conteúdo
- Crie tutoriais

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos
- **Node.js** 18 ou superior
- **npm** 9 ou superior
- **Git** configurado
- Conta no **Stripe** (para funcionalidades premium)

### Instalação
```bash
# 1. Fork o repositório no GitHub
# 2. Clone seu fork
git clone https://github.com/SEU-USUARIO/meus-medicamentos.git
cd meus-medicamentos

# 3. Instale dependências
npm install
cd server && npm install && cd ..

# 4. Configure variáveis de ambiente
cp frontend.env.example .env
cp server/config.example.env server/.env
# Edite os arquivos .env com suas configurações

# 5. Inicie o ambiente de desenvolvimento
./start-system.sh
```

### Verificação da Instalação
```bash
# Frontend deve estar em http://localhost:5173
# Backend deve estar em http://localhost:3001
# Health check: curl http://localhost:3001/health
```

---

## 🔄 Processo de Desenvolvimento

### 1. Escolha uma Issue
- Procure issues marcadas com `good first issue` para começar
- Comente na issue que você quer trabalhar nela
- Aguarde confirmação antes de começar

### 2. Crie uma Branch
```bash
git checkout -b feature/nome-da-funcionalidade
# ou
git checkout -b bugfix/nome-do-bug
```

### 3. Desenvolva
- Faça commits pequenos e frequentes
- Escreva mensagens de commit descritivas
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada

### 4. Teste
```bash
# Testes do frontend
npm test

# Testes do backend
cd server && npm test

# Lint
npm run lint
cd server && npm run lint
```

### 5. Submeta um Pull Request
- Use o [template de PR](.github/pull_request_template.md)
- Referencie a issue relacionada
- Inclua screenshots se houver mudanças visuais
- Aguarde review e feedback

---

## 📝 Padrões de Código

### JavaScript/React
```javascript
// ✅ Bom
const MedicationCard = ({ medication, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => {
    onEdit(medication.id);
  }, [medication.id, onEdit]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {medication.name}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ❌ Evite
function medicationCard(props) {
  return <div>{props.medication.name}</div>;
}
```

### Estrutura de Arquivos
```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes comuns
│   └── specific/       # Componentes específicos
├── services/           # Serviços e APIs
├── utils/              # Utilitários
├── hooks/              # Custom hooks
└── constants/          # Constantes
```

### Nomenclatura
- **Componentes**: PascalCase (`MedicationForm`)
- **Arquivos**: kebab-case (`medication-form.jsx`)
- **Variáveis**: camelCase (`isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### CSS/Styling
- Use Material-UI components quando possível
- Prefira styled components ou sx prop
- Mantenha consistência com o tema
- Use variáveis para cores e espaçamentos

---

## 📝 Commits e Pull Requests

### Formato de Commit
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: mudanças na documentação
- `style`: formatação, ponto e vírgula, etc
- `refactor`: refatoração de código
- `perf`: melhoria de performance
- `test`: adição ou correção de testes
- `chore`: mudanças no build, CI, etc

### Exemplos
```bash
feat(medication): adicionar filtro por tipo de medicação
fix(stripe): corrigir erro de validação no checkout
docs(readme): atualizar instruções de instalação
style(button): ajustar espaçamento dos botões
```

### Pull Request
- **Título claro** que descreve a mudança
- **Descrição detalhada** usando o template
- **Screenshots** para mudanças visuais
- **Testes** que comprovem que a mudança funciona
- **Documentação** atualizada se necessário

---

## 🐛 Reportando Bugs

### Antes de Reportar
1. **Procure** por issues similares existentes
2. **Teste** em modo incógnito/privado
3. **Limpe** cache e cookies
4. **Reproduza** o bug consistentemente

### Informações Necessárias
- **Passos detalhados** para reproduzir
- **Comportamento esperado** vs atual
- **Screenshots** ou vídeos
- **Informações do ambiente** (OS, browser, versão)
- **Logs de erro** do console
- **Contexto adicional** (versão gratuita/premium, etc)

### Exemplo de Bug Report
```markdown
## 🐛 Descrição
O botão "Salvar Medicação" não responde quando clicado.

## 🔄 Passos para Reproduzir
1. Abra o formulário de nova medicação
2. Preencha todos os campos obrigatórios
3. Clique em "Salvar Medicação"
4. Nada acontece

## ✅ Comportamento Esperado
A medicação deveria ser salva e aparecer na lista.

## 🖥️ Ambiente
- OS: macOS Big Sur 11.6
- Browser: Chrome 96.0.4664.110
- Versão: 1.2.3
```

---

## ✨ Sugerindo Funcionalidades

### Antes de Sugerir
1. **Verifique** se já existe uma sugestão similar
2. **Considere** se alinha com os objetivos do projeto
3. **Pense** no impacto nos usuários existentes
4. **Avalie** a complexidade de implementação

### Estrutura da Sugestão
- **Problema** que a funcionalidade resolve
- **Solução proposta** detalhada
- **Alternativas** consideradas
- **Mockups** ou exemplos visuais
- **Impacto** nos usuários
- **Considerações técnicas**

---

## 🧪 Testes

### Tipos de Teste
- **Unitários**: Testam componentes isolados
- **Integração**: Testam fluxos completos
- **E2E**: Testam cenários de usuário real

### Executando Testes
```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage

# E2E (se configurado)
npm run test:e2e
```

### Escrevendo Testes
```javascript
// Exemplo de teste de componente
import { render, screen, fireEvent } from '@testing-library/react';
import MedicationForm from './MedicationForm';

test('deve salvar medicação quando formulário válido', () => {
  const mockOnSave = jest.fn();
  render(<MedicationForm onSave={mockOnSave} />);
  
  fireEvent.change(screen.getByLabelText('Nome'), {
    target: { value: 'Aspirina' }
  });
  
  fireEvent.click(screen.getByText('Salvar'));
  
  expect(mockOnSave).toHaveBeenCalledWith({
    name: 'Aspirina'
  });
});
```

---

## 🏷️ Labels e Issues

### Labels de Prioridade
- `priority: high` - Crítico, precisa ser resolvido rapidamente
- `priority: medium` - Importante, mas não urgente
- `priority: low` - Nice to have, pode esperar

### Labels de Tipo
- `bug` - Algo não está funcionando
- `enhancement` - Nova funcionalidade ou melhoria
- `documentation` - Relacionado à documentação
- `question` - Dúvida ou discussão

### Labels de Status
- `good first issue` - Bom para iniciantes
- `help wanted` - Precisa de ajuda da comunidade
- `needs-review` - Precisa de revisão
- `work-in-progress` - Em desenvolvimento

---

## 📞 Obtendo Ajuda

### Canais de Comunicação
- **GitHub Issues** - Para bugs e funcionalidades
- **GitHub Discussions** - Para perguntas gerais
- **Email** - contato@meusmedicamentos.com

### Antes de Pedir Ajuda
1. Leia a documentação
2. Procure por issues similares
3. Tente reproduzir o problema
4. Prepare informações detalhadas

---

## 🎉 Reconhecimento

Contribuidores são reconhecidos:
- **README.md** - Lista de contribuidores
- **CHANGELOG.md** - Créditos nas releases
- **GitHub** - Perfil destacado no repositório

### Hall da Fama 🌟
Contribuidores especiais que fizeram diferença significativa no projeto.

---

## 📚 Recursos Úteis

### Documentação
- [React Documentation](https://reactjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Node.js Documentation](https://nodejs.org/docs)

### Ferramentas
- [VS Code](https://code.visualstudio.com/) - Editor recomendado
- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

### Aprendizado
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [JavaScript Modern](https://javascript.info/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

## ❓ FAQ

### Como escolho uma issue para trabalhar?
Procure por issues marcadas com `good first issue` se você é iniciante, ou `help wanted` se tem mais experiência.

### Posso trabalhar em múltiplas issues ao mesmo tempo?
É melhor focar em uma issue por vez para manter qualidade e evitar conflitos.

### Quanto tempo tenho para completar uma issue?
Não há prazo fixo, mas comunique se precisar de mais tempo ou não puder continuar.

### Como faço para sincronizar meu fork?
```bash
git remote add upstream https://github.com/original-owner/meus-medicamentos.git
git fetch upstream
git checkout main
git merge upstream/main
```

---

**Obrigado por contribuir! 🙏**

Sua contribuição, independente do tamanho, faz a diferença para a comunidade de usuários do Meus Medicamentos.

---

*Este guia está em constante evolução. Sugestões de melhorias são bem-vindas!*
