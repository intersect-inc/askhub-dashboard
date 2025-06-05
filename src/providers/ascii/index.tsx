'use client'

type Props = {
  children: React.ReactNode
}

export const AsciiProvider = (props: Props) => {
  const { children } = props
  // eslint-disable-next-line no-console
  console.log(`

                    @@@@ @@@@
                -@@@@@@@ @@@@@@@-
              .@@@@@@@@@ @@@@@@@@@+
             @@@@@@@@@@@ @@@@@@@@@@@
            @@@@@@@@@@@@ @@@@@@@@@@@@
           .@@@@@@@@@@@@ @@@@@@@@@@@@+
           %@@@@@@@@@@@@ @@@@@@@@@@@@@
           @@@@@@@@@@@@@           +@=
           =@@@@@@@@@@@@       @@@@@@@
            @@@@@@@@@@@@     @@@@@@@@@
            :@@@@@@@@@@@   @@@@@@@@@@@
              @@@@@@@@@@  @@@@@@@@@@@@
               *@@@@@@@@ +@@@@@@@@@@@@
                 .@@@@@@ @@@@@@@@@@@@@

`)

  return children
}
