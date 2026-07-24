// Sem backend por trás do site: o formulário monta um link mailto: com os
// dados preenchidos e abre o cliente de e-mail do visitante, endereçado
// diretamente para a Gravit.
export function initContactForm(form, { to = 'gravitstudios@gmail.com' } = {}) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();

    const subject = `Orçamento — ${name || 'Novo contato pelo site'}`;
    const body = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;

    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
}
