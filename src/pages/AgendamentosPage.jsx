import { differenceInHours } from "date-fns";
import {
  ArrowLeftRight,
  Calendar,
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

export default function AgendamentoPage() {
  const [selected, setSelected] = useState(new Date());

  console.log(selected);

  // struct
  // id;
  // preco;
  // cliente;
  // telefone;
  // formaPagamento;
  // inicio;
  // fim;

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
  ];

  const formatCurrecy = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

            <h2 className="font-semibold text-lg mb-3">Proximas Sessões</h2>

            <div className=" flex flex-col gap-3">
              {agendamentos.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex bg-[#0A1A3D] border border-[#0CC0DF]/10 w-full p-3 justify-between rounded-xl"
                >
                  <div className="flex gap-4 items-center">
                    <span className="w-10 h-10 rounded-full bg-[#48DCFC]/10 flex items-center justify-center">
                      <CirclePlus
                        className="text-[#48DCFC]"
                        width={20}
                        height={20}
                      />
                    </span>
                    <div>
                      <h4 className=" font-semibold">{agendamento.cliente}</h4>
                      <p className="text-xs text-[#BBC9CD] font-normal">
                        Em {differenceInHours(agendamento.inicio, new Date())}{" "}
                        horas
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
              ))}
            </div>
          </div>

          {/* CALENDARIO */}

          <section className="flex-grow h-full w-full  grid grid-cols-12 border grid-rows-10 border-[#3C494D]/10 rounded-3xl ">
            <div className="col-start-1 col-end-2 row-span-10 grid grid-rows-10">
              <div className=" flex justify-center items-center border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50 rounded-tl-3xl ">
                <Clock width={15} height={15} />
              </div>
            </div>

            <div className="w-full   rounded-3xl grid grid-cols-7 grid-rows-10 h-full col-start-2 col-end-13 row-start-1 row-end-11">
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
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
