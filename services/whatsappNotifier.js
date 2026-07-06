/**
 * WhatsApp Notifier — Korea Autos
 * Envia notificaciones via WhatsApp Cloud API cuando entra/sale un vehiculo.
 * Non-blocking: errores de notificacion no afectan el flujo principal.
 */

const PHONE_NUMBER_ID = "1213421528514747";
const WA_TOKEN = "EAASz9Hxaxf0BRsIsi80aKLaddrlx0GtOk0lr5RwdPOmYQvWWy94Lbg6FoDLWRhKponEQNyb3e2Gh0DXdhZAXnZAMdAX3Khm2ZCEY5u8YyZAEYjQaKVhNb1EoTfbzaRfJ5sIx8xyuVqsAWiNzqJn5TSEFzvljxUygypQZCFZBur1wb9bOhmrJAdxNSZC0ZC9YJAZDZD";
const API_URL = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;

const RECIPIENTS = [
    "50247527044",  // Gustavo (Korea Autos)
    "50237599969",  // Giovanni
    "50258597018",  // Elizabeth (esposa Giovanni)
];

function gtmNow() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Guatemala' }));
}

function formatDate() {
    const d = gtmNow();
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

function formatTime() {
    const d = gtmNow();
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2,'0')} ${ampm}`;
}

const STATUS_LABELS = {
    1: "Recepcion de Vehiculos",
    2: "Asignacion y Diagnostico",
    3: "Presupuesto",
    4: "Autorizacion",
    5: "Inicio de Proceso",
    6: "Entrega de Requisicion",
    7: "Entrega de Repuestos a Tecnico",
    8: "Control de Calidad",
    9: "Cierre de Proceso",
};

async function sendText(to, text) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WA_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: { body: text },
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            console.error(`[WA] Error enviando a ${to}:`, data.error?.message || data);
        }
        return res.ok;
    } catch (err) {
        console.error(`[WA] Error de red enviando a ${to}:`, err.message);
        return false;
    }
}

async function notifyAll(text) {
    const results = await Promise.allSettled(
        RECIPIENTS.map(to => sendText(to, text))
    );
    const ok = results.filter(r => r.status === "fulfilled" && r.value).length;
    console.log(`[WA] Notificacion enviada a ${ok}/${RECIPIENTS.length} destinatarios`);
}

/**
 * Notifica que un vehiculo entro al taller (orden creada, status 1)
 */
async function notifyVehicleEntry(order, client, vehicle, vendor) {
    const plate = vehicle?.plate_id || "Sin placa";
    const brand = vehicle?.vehicule_brand?.name || "";
    const type = vehicle?.vehicule_type?.name || "";
    const line = vehicle?.vehicle_line?.name || vehicle?.linea || "No Definida";
    const clientName = client?.name || "Sin cliente";
    const vendorName = vendor?.name || "";
    const numberPass = order.number_pass || order.id;
    const companyName = order.company?.name || "Korea Autos";

    const msg = `🚗 *${companyName}*\n*VEHICULO INGRESADO*\n\n` +
        `📋 Orden: #${numberPass}\n` +
        `👤 Cliente: ${clientName}\n` +
        `🚙 Marca: ${brand} ${type}\n` +
        `🚘 Linea: ${line}\n` +
        `🔢 Placa: ${plate}\n` +
        `🏪 Proveedor: ${vendorName}\n` +
        `📅 Fecha: ${formatDate()}\n` +
        `⏰ Hora: ${formatTime()}`;

    await notifyAll(msg);
}

/**
 * Notifica que un vehiculo salio del taller (status 9)
 */
async function notifyVehicleExit(order, client, vehicle) {
    const plate = vehicle?.plate_id || "Sin placa";
    const brand = vehicle?.vehicule_brand?.name || "";
    const type = vehicle?.vehicule_type?.name || "";
    const line = vehicle?.vehicle_line?.name || vehicle?.linea || "No Definida";
    const clientName = client?.name || "Sin cliente";
    const numberPass = order.number_pass || order.id;
    const companyName = order.company?.name || "Korea Autos";

    const msg = `✅ *${companyName}*\n*VEHICULO ENTREGADO*\n\n` +
        `📋 Orden: #${numberPass}\n` +
        `👤 Cliente: ${clientName}\n` +
        `🚙 Marca: ${brand} ${type}\n` +
        `🚘 Linea: ${line}\n` +
        `🔢 Placa: ${plate}\n` +
        `📅 Fecha: ${formatDate()}\n` +
        `⏰ Hora: ${formatTime()}`;

    await notifyAll(msg);
}

/**
 * Notifica cambio de status generico (opcional, para status intermedios)
 */
async function notifyStatusChange(order, newStatus, client, vehicle) {
    const plate = vehicle?.plate_id || "Sin placa";
    const clientName = client?.name || "Sin cliente";
    const numberPass = order.number_pass || order.id;
    const statusLabel = STATUS_LABELS[newStatus] || `Status ${newStatus}`;
    const companyName = order.company?.name || "Korea Autos";

    const msg = `🔄 *${companyName}*\n*CAMBIO DE STATUS*\n\n` +
        `📋 Orden: #${numberPass}\n` +
        `👤 Cliente: ${clientName}\n` +
        `🔢 Placa: ${plate}\n` +
        `📊 Nuevo status: ${statusLabel}`;

    await notifyAll(msg);
}

module.exports = { notifyVehicleEntry, notifyVehicleExit, notifyStatusChange, sendText, notifyAll };
