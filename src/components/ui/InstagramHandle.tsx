/**
 * A handle has no spaces, so a narrow phone would either overflow the box or
 * break it mid-word. Marking the dots as break opportunities keeps each
 * segment whole.
 */
export function InstagramHandle({ handle }: { handle: string }) {
  const parts = handle.split('.');

  return (
    <span>
      {parts.map((part, i) => (
        <span key={part}>
          {i === 0 ? `@${part}` : part}
          {i < parts.length - 1 && (
            <>
              .<wbr />
            </>
          )}
        </span>
      ))}
    </span>
  );
}
