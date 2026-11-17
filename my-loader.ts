// eslint-disable-next-line unicorn/filename-case
export default function localLoader({ src }: { src: string }) {
  return `https://raw.githubusercontent.com/OldManTurtle/rpg-tools/refs/heads/pages/public/${src}`;
}
