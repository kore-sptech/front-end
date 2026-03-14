
function formatDate(dateString) {

    const data = new Date(dateString); // Note que T00:00:00 é necessário para evitar problemas de fuso horário local

    const formatador = new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return formatador.format(data);
}

function formatCurrency(value = 0) {
    console.log("Valor a formatar:", value);

    const formattedBR = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);


    return formattedBR;
}

function formatPhone(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
