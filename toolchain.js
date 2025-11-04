document.addEventListener("DOMContentLoaded", () => {

  const steps = [
    { title: "[1] Install required packages for building the RISC-V GNU Toolchain.", cmds: [`sudo apt update`,`sudo apt install -y build-essential git libgmp-dev libmpfr-dev libmpc-dev texinfo bison flex libtool patchutils bc zlib1g-dev libexpat-dev`] },
    { title: "[2] Clone the repository in WSL home directory (case-sensitive filesystem) to avoid build errors.", cmds: [`cd ~`,`git clone https://github.com/riscv/riscv-gnu-toolchain riscv-gnu-toolchain-rv32i`,`cd riscv-gnu-toolchain-rv32i`] },
    { title: "[3] Create a separate directory for build files to keep them isolated from source files.", cmds: ["mkdir build && cd build"] },
    { title: "[4] Configure the toolchain with <code>--prefix</code> for the install path, <code>--with-arch</code> to set RV32I, and <code>--with-abi</code> to set ILP32.", cmds: [`../configure --prefix=/opt/riscv32i --with-arch=rv32i --with-abi=ilp32`] },
    { title: "[5] Build the toolchain, using multiple CPU cores for faster compilation.", cmds: ["make -j$(nproc)"] },
    { title: "[6] Install the compiled toolchain to the specified directory.", cmds: ["sudo make install"] },    
    { title: "[7] Check that the toolchain is configured with <code>--with-arch=rv32i</code> and <code>--with-abi=ilp32</code>.", cmds: [`riscv32-unknown-elf-gcc -v`,`ls /opt/riscv32i/bin`] },
    { title: "[8] Add the toolchain to your PATH permanently.", cmds: [`echo 'export PATH=/opt/riscv32i/bin:$PATH' >> ~/.bashrc`, `source ~/.bashrc`] }
  ];

  const pro = [
    { title: "Program add_two_numb.c", cmds: ["#include <stdint.h>\nvolatile uint32_t data_mem[4];\nint main() {\n    data_mem[0] = 7;\n    data_mem[1] = 13;\n    uint32_t reg_a = data_mem[0];\n    uint32_t reg_b = data_mem[1];\n    uint32_t reg_sum = reg_a + reg_b;\n    data_mem[2] = reg_sum;\n    while (1) {}\n    return 0;\n}"] },
    { title: "Complie and make coe file using risc-v toolchain with a simple linker link.ld for vivado bram IP", cmds: [`riscv32-unknown-elf-g++ -O2 -march=rv32i -mabi=ilp32 -nostdlib -T link.ld -o add_two_numb.elf add_two_numb.c`,
        `riscv32-unknown-elf-objdump -d add_two_numb.elf > add_two_numb.S`,
        `riscv32-unknown-elf-objcopy -O binary add_two_numb.elf add_two_numb.bin`,
        `xxd -p add_two_numb.bin | tr -d '\\n' > add_two_numb.txt`,
        `echo "memory_initialization_radix=16;" > add_two_numb.coe`,
        `echo "memory_initialization_vector=" >> add_two_numb.coe`,
        `xxd -p add_two_numb.bin | sed 's/../& /g' >> add_two_numb.coe`] }
  ];

  const buildAttr = (attr, val) => `[${attr}="${CSS.escape(val)}"]`;

  const addKeywords = (containerId, items, attr) => {
    const container = document.getElementById(containerId);
    items.forEach(k => {
      const label = k.title || k;
      const el = document.createElement("div");
      el.className = "keyword";
      el.innerHTML = `<code>${label}</code>`;
      el.addEventListener("click", () => {
        const target = document.querySelector(buildAttr(attr, label));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.classList.add("highlight");
          setTimeout(() => target.classList.remove("highlight"), 1500);
        }
      });
      container.appendChild(el);
    });
  };

  // RISC-V section
  const tutorial = document.getElementById("tutorial");
  steps.forEach(s => {
    const section = document.createElement("div");
    section.className = "step";
    section.innerHTML = `<div class="step-title">${s.title}</div>`;
    const list = document.createElement("div");
    list.className = "command-list";
    s.cmds.forEach(cmd => {
      const wrap = document.createElement("div");
      wrap.className = "cmd-wrap";
      const pre = document.createElement("pre");
      pre.className = "cmd";
      pre.textContent = cmd;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(cmd);
          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy", 1000);
        } catch { alert("Copy failed"); }
      });
      wrap.appendChild(pre);
      wrap.appendChild(btn);
      list.appendChild(wrap);
    });
    section.appendChild(list);
    tutorial.appendChild(section);
  });

  
  const program = document.getElementById("program");
  pro.forEach(s => {
    const section = document.createElement("div");
    section.className = "step";
    section.innerHTML = `<div class="step-title">${s.title}</div>`;
    const list = document.createElement("div");
    list.className = "command-list";
    s.cmds.forEach(cmd => {
      const wrap = document.createElement("div");
      wrap.className = "cmd-wrap";
      const pre = document.createElement("pre");
      pre.className = "cmd";
      pre.textContent = cmd;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(cmd);
          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy", 1000);
        } catch { alert("Copy failed"); }
      });
      wrap.appendChild(pre);
      wrap.appendChild(btn);
      list.appendChild(wrap);
    });
    section.appendChild(list);
    program.appendChild(section);
  });
});
