/*===========================================================
  Minimal Linker Script for RISC-V RV32I Bare-Metal Simulation
  Compatible with riscv32-unknown-elf-gcc 15.1.0
===========================================================*/

ENTRY(_start)

/* Memory map: 64 KB total RAM starting at 0x00000000 */
MEMORY
{
  RAM (rwx) : ORIGIN = 0x00000000, LENGTH = 64K
}

/* Section placement */
SECTIONS
{
  /* --- Code + read-only data --- */
  .text : ALIGN(4)
  {
    KEEP(*(.init))          /* startup code */
    KEEP(*(.text.boot))     /* boot section */
    *(.text*)               /* code */
    *(.rodata*)             /* const data */
  } > RAM

  /* --- Initialized data --- */
  .data : ALIGN(4)
  {
    *(.data*)
  } > RAM

  /* --- Zero-initialized data --- */
  .bss (NOLOAD) : ALIGN(4)
  {
    *(.bss*)
    *(COMMON)
  } > RAM

  /* --- Stack (top of memory, grows down) --- */
  _stack_top = ORIGIN(RAM) + LENGTH(RAM);
  PROVIDE(_stack_pointer = _stack_top);
}
