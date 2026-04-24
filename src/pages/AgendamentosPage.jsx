import { differenceInHours } from "date-fns";
import {
  ArrowLeftRight,
  CalendarPlus,
  CirclePlus,
  Clock,
  Home,
} from "lucide-react";
import { useState } from "react";

import { DayPicker } from "react-day-picker";

import { ptBR } from "react-day-picker/locale";

import "react-day-picker/style.css";
import AsideBar from "../components/Aside";
import { formatCurrecy } from "../utils/formmaters";
import { da } from "date-fns/locale";

export default function AgendamentoPage() {
  const currentDate = new Date();

  const agendamentos = [
    {
      id: 1,
      preco: 20.0,
      cliente: "henry",
      telefone: "123456789",
      formaPagamento: "PIX",
      inicio: currentDate.setHours(currentDate.getHours() + 2),
      fim: currentDate.setHours(currentDate.getHours() + 4),
    },
    {
      id: 2,
      preco: 30.0,
      cliente: "vitor",
      telefone: "123456789",
      formaPagamento: "PIX",
      inicio: currentDate.setHours(currentDate.getHours() + 6),
      fim: currentDate.setHours(currentDate.getHours() + 8),
    },

    {
      id: 3,
      preco: 40.0,
      cliente: "diogo",
      telefone: "123456789",
      formaPagamento: "PIX",
      inicio: currentDate.setHours(currentDate.getHours() + 10),
      fim: currentDate.setHours(currentDate.getHours() + 12),
    },
    {
      id: 4,
      preco: 40.0,
      cliente: "diogo",
      telefone: "123456789",
      formaPagamento: "PIX",
      inicio: currentDate.setHours(currentDate.getHours() + 10),
      fim: currentDate.setHours(currentDate.getHours() + 12),
    },
    {
      id: 5,
      preco: 40.0,
      cliente: "diogo",
      telefone: "123456789",
      formaPagamento: "PIX",
      inicio: currentDate.setHours(currentDate.getHours() + 10),
      fim: currentDate.setHours(currentDate.getHours() + 12),
    }
  ];

  const colors = [
    "blue",
    "ghost",
    "orange",
    "green",
    "purple",
    "pink",
    "indigo",
    "teal",
  ];

  function hashColor(name) {
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  // Monta o mapa percorrendo os agendamentos

  const colorMapByName = [...new Set(agendamentos.map((a) => a.cliente))]
    .sort() // ordem alfabética → sempre a mesma
    .reduce((map, name, i) => {
      map[name] = colors[i % colors.length];
      return map;
    }, {});
  console.log(colorMapByName);

  const mapDayOfWeekName = {
    0: "SEG",
    1: "TER",
    2: "QUA",
    3: "QUI",
    4: "SEX",
    5: "SAB",
    6: "DOM",
  };

  console.log(agendamentos[0].inicio);

  return (
    <main className="h-screen w-full flex bg-[#000C24] text-[#DAE2FF]">
      <AsideBar />

      <section className="flex-grow h-full ">
        <div className="p-6 flex w-full justify-between">
          <h1 className="text-4xl font-bold">AGENDAMENTO</h1>

          <button className="flex gap-2 px-6 py-2.5 bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/20 cursor-pointer">
            <CalendarPlus />
            Agendar
          </button>
        </div>

        <div className="flex px-6 gap-6 flex-grow  h-[85%]">
          {/* AGENDA */}
          <div className="flex-grow h-full">
            <Calendar />
            <h2 className="font-semibold text-lg mb-3">Proximas Sessões</h2>
            <ListAppoioments agendamentos={agendamentos} />
          </div>

          {/* CALENDARIO */}

          <AppointmentTable>
            <AppointmentTimesTable />

            <div className="w-full   rounded-3xl grid grid-cols-7 grid-rows-8 h-full col-start-2 col-end-13 row-start-1 row-end-11">
              {/* CABECALHO */}
              <AppointmentOfWeekTableHead />
              {/* AGENDAMENTO */}
              {Array.from({ length: 49 - 9 }, (_, i) => (
                <div
                  className={`flex justify-center p-1 border-b border-r border-[#3C494D]/10  `}
                ></div>
              ))}

              {agendamentos.map((agendamento) => {
                return (
                  <AppointmentTdata
                    agendamento={agendamento}
                    type={colorMapByName[agendamento.cliente]}
                    timeInHours={differenceInHours(
                      new Date(agendamento.fim),
                      new Date(agendamento.inicio),
                    )}
                    startHour={new Date(agendamento.inicio).getHours()}
                    dayOfWeek={
                      mapDayOfWeekName[new Date(agendamento.inicio).getDay()]
                    }
                  />
                );
              })}
            </div>
          </AppointmentTable>
        </div>
      </section>
    </main>
  );
}

function ListAppoioments({ agendamentos }) {
  return (
    <>
      <div className=" flex flex-col gap-3">
        {agendamentos.map((agendamento) => (
          <AppoiomentItem agendamento={agendamento} />
        ))}
      </div>
    </>
  );
}

function AppoiomentItem({ agendamento }) {
  return (
    <>
      <div
        key={agendamento.id}
        className="flex bg-[#0A1A3D] border border-[#0CC0DF]/10 w-full p-3 justify-between rounded-xl"
      >
        <div className="flex gap-4 items-center">
          <span className="w-10 h-10 rounded-full bg-[#48DCFC]/10 flex items-center justify-center">
            <CirclePlus className="text-[#48DCFC]" width={20} height={20} />
          </span>
          <div>
            <h4 className=" font-semibold">{agendamento.cliente}</h4>
            <p className="text-xs text-[#BBC9CD] font-normal">
              Em {differenceInHours(agendamento.inicio, new Date())} horas
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-[#48DCFC] font-bold">
            {formatCurrecy.format(agendamento.preco)}
          </p>
          <p className="text-[#48DCFC] font-bold text-[10px] bg-[#48DCFC]/10 px-2 py-1 rounded-full w-fit">
            {agendamento.formaPagamento}
          </p>
        </div>
      </div>
    </>
  );
}

function Calendar() {
  const [selected, setSelected] = useState(new Date());

  return (
    <>
      <DayPicker
        className="mb-6"
        animate
        mode="single"
        selected={selected}
        onSelect={setSelected}
        locale={ptBR}
        classNames={{
          selected: `text-[#0CC0DF]`, // Highlight the selected day
          chevron: `fill-[#0CC0DF]`, // Change the color of the chevron
        }}
      />
    </>
  );
}

function AppointmentOfWeekTableHead() {
  return (
    <>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50">
        <p className="text-[#48DCFC] font-bold text-xs">SEG</p>
        <p className="font-bold text-lg">05</p>
      </div>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50">
        <p className="text-[#BBC9CD] font-bold text-xs">TER</p>
        <p className="font-bold text-lg">06</p>
      </div>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50">
        <p className="text-[#BBC9CD] font-bold text-xs">QUA</p>
        <p className="font-bold text-lg">07</p>
      </div>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50">
        <p className="text-[#BBC9CD] font-bold text-xs">QUI</p>
        <p className="font-bold text-lg">08</p>
      </div>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50">
        <p className="text-[#BBC9CD] font-bold text-xs">SEX</p>
        <p className="font-bold text-lg">09</p>
      </div>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50">
        <p className="text-[#BBC9CD] font-bold text-xs">SAB</p>
        <p className="font-bold text-lg">10</p>
      </div>
      <div className=" flex justify-center items-center flex-col gap-0 border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50 rounded-tr-3xl">
        <p className="text-[#BBC9CD] font-bold text-xs">DOM</p>
        <p className="font-bold text-lg">11</p>
      </div>
    </>
  );
}

function AppointmentTimesTable() {
  const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  return (
    <>
      <div
        className={`col-start-1 col-end-2 row-span-10 grid grid-rows-${times.length + 1}`}
      >
        <div className=" flex justify-center items-center border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50 rounded-tl-3xl ">
          <Clock width={15} height={15} />
        </div>
        {times.map((time) => (
          <AppointmentTimeTdata key={time}>{time}</AppointmentTimeTdata>
        ))}
      </div>
    </>
  );
}

function AppointmentTimeTdata({ children }) {
  return (
    <>
      <div className=" flex justify-center pt-4 border-b border-r border-[#3C494D]/10  ">
        <p className="font-bold text-sm text-[#BBC9CD]/40">{children}</p>
      </div>
    </>
  );
}

function AppointmentTable({ children }) {
  return (
    <section className="flex-grow h-full w-full  grid grid-cols-12 border grid-rows-8 border-[#3C494D]/10 rounded-3xl bg-[#0A1A3D]">
      {children}
    </section>
  );
}

const COLOR_STYLES = {
  green: {
    bg: "bg-[#3F7334]/20",
    border: "border-[#8FFFA8]",
    title: "text-[#8FFFA8]",
    text: "text-[#DAE2FF]",
  },
  purple: {
    bg: "bg-[#344573]/20",
    border: "border-[#B4C5FB]",
    title: "text-[#B4C5FB]",
    text: "text-[#B4C5FB]",
  },
  orange: {
    bg: "bg-[#22263E]",
    border: "border-[#F99844]",
    title: "text-[#FFBD8B]",
    text: "text-[#DAE2FF]",
  },
  blue: {
    bg: "bg-[#0A1F4B]",
    border: "border-[#48DCFC]",
    title: "text-[#48DCFC]",
    text: "text-[#DAE2FF]",
  },
  ghost: {
    bg: "bg-[#122348]",
    border: "border-[#B4C5FB]",
    title: "text-[#DAE2FF]",
    text: "text-[#DAE2FF]",
    extra: "opacity-50",
  },
  pink: {
    bg: "bg-[#4A1942]/20",
    border: "border-[#FF8EE8]",
    title: "text-[#FF8EE8]",
    text: "text-[#DAE2FF]",
  },
  indigo: {
    bg: "bg-[#1E1B4B]/20",
    border: "border-[#A5B4FC]",
    title: "text-[#A5B4FC]",
    text: "text-[#DAE2FF]",
  },
  teal: {
    bg: "bg-[#0F2E2E]/20",
    border: "border-[#2DD4BF]",
    title: "text-[#2DD4BF]",
    text: "text-[#DAE2FF]",
  },
};

const DAY_COLUMNS = {
  SEG: "col-start-1 col-end-2",
  TER: "col-start-2 col-end-3",
  QUA: "col-start-3 col-end-4",
  QUI: "col-start-4 col-end-5",
  SEX: "col-start-5 col-end-6",
  SAB: "col-start-6 col-end-7",
  DOM: "col-start-7 col-end-8",
};

const INITIAL_HOUR = 8;

function AppointmentTdata({
  agendamento,
  timeInHours,
  dayOfWeek,
  startHour,
  type,
}) {
  const style = COLOR_STYLES[type] ?? COLOR_STYLES.ghost;
  const columnSpan = DAY_COLUMNS[dayOfWeek] ?? DAY_COLUMNS.SEG;

  const startRow = startHour - INITIAL_HOUR;
  const startRowPosition = `row-start-${startRow + 2}`;
  const endRowPosition = `row-end-${startRow + timeInHours + 2}`;

  return (
    <div
      className={`flex justify-center p-1 border-b border-r cursor-pointer border-[#3C494D]/10 ${startRowPosition} ${endRowPosition} ${columnSpan}`}
    >
      <div
        className={`w-full h-full ${style.bg} rounded-lg p-2 pl-4 border-l-4 ${style.border} flex flex-col justify-between ${style.extra ?? ""}`}
      >
        <h3 className={`text-sm font-bold ${style.title}`}>
          {agendamento.servico}
        </h3>
        <p className={`text-sm font-bold ${style.text}`}>
          {agendamento.cliente}
        </p>
      </div>
    </div>
  );
}
