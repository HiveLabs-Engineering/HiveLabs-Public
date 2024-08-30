import { z } from "zod";
import { Resend } from "resend";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { randomUUID } from "crypto";

const resend = new Resend("");

export const authRouter = createTRPCRouter({
  verify: publicProcedure
    .input(
      z.object({ email: z.string(), username: z.string(), userId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, username, userId } = input;
      const existingUser = await ctx.db.user.findFirst({ where: { email } });
      const pendingLink = await ctx.db.emailLinks.findFirst({
        where: { userId },
      });

      if (existingUser) {
        return { msg: "Failed to send email -- user already exists." };
      }

      if (pendingLink) {
        await ctx.db.emailLinks.deleteMany({ where: { userId } });
      }

      const generateRandomNumbers = () =>
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 10));
      const randomNumbers = generateRandomNumbers();
      const code = randomNumbers.join("");
      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

      await ctx.db.emailLinks.create({
        data: { userId, code, expires, email },
      });

      const numbersHtml = randomNumbers
        .map(
          (num) => `
            <p style="display: inline-block; width: 2.5rem; height: 2.5rem; line-height: 2.5rem; font-size: 1.5rem; font-weight: 500; color: #09090b; text-align: center; border: 1px solid #09090b; border-radius: 0.375rem; margin: 0.2rem;">
            ${num}
        </p>
        
            `,
        )
        .join("");

      const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Email</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f7;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f7;">
                    <tr>
                        <td align="center" style="padding: 2rem 1.5rem;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 32rem; background-color: #FFFFFF; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 2rem;">
                                        <h2 style="color: #18181b; margin: 0; font-size: 24px;">Hey there ${username},</h2>
                                        <p style="margin: 0.5rem 0 0; line-height: 1.75; color: #3f3f46;">
                                            Here is the verification code you requested:
                                        </p>
                                        <div style="display: flex; align-items: center; margin: 0.5rem 0; gap: 1rem;">
                                            ${numbersHtml}
                                        </div>
                                        <p style="margin: 0.5rem 0 0; line-height: 1.75; color: #3f3f46;">
                                            This code will only be valid for the next 5 minutes. If the code does not work, please resend the code to your email.
                                        </p>
                                        <p style="margin: 1rem 0 0; line-height: 1.75; color: #3f3f46;">
                                            Thanks, <br> Team HiveLabs
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 1rem 2rem; background-color: #f4f4f7; text-align: center;">
                                        <p style="margin: 0; color: #71717a; font-size: 12px;">
                                            This email was sent to <a href="#" style="color: #18181b; text-decoration: underline;" target="_blank">${email}</a>.
                                            If you did not request this email, please ignore it or contact <a href="mailto:team@hivelabs.app" style="color: #18181b; text-decoration: underline;" target="_blank">team@hivelabs.app</a>
                                        </p>
                                        <p style="margin: 0.75rem 0 0; color: #71717a; font-size: 12px;">
                                            © ${new Date().getFullYear()} HiveLabs. All Rights Reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            
            `;

      const { data, error } = await resend.emails.send({
        from: "HiveLabs <team@hivelabs.app>",
        to: email,
        subject: "Verify your HiveLabs account",
        html: htmlContent,
        headers: { "X-Entity-Ref-ID": randomUUID() },
      });

      return {
        msg: error
          ? "Failed to send email."
          : "Verification email successfully sent.",
      };
    }),
  validate: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.code) {
        return { msg: "Missing required fields" };
      }

      try {
        let verification = await ctx.db.emailLinks.findFirst({
          where: {
            code: input.code,
          },
        });

        if (verification) {
          let userData = await ctx.db.user.findFirst({
            where: {
              userId: verification.userId,
            },
          });

          await ctx.db.user.update({
            where: {
              userId: verification.userId,
            },
            data: {
              email: verification.email,
            },
          });

          await ctx.db.emailLinks.delete({
            where: {
              id: `${verification.id}`,
            },
          });

          return {
            success: true,
            email: verification.email,
            userId: userData?.userId,
            username: userData?.username,
          };
        } else {
          return {
            success: false,
            message: "Missing required fields.",
          };
        }
      } catch (error) {
        return {
          success: false,
          message: "Internal Server Error",
        };
      }
    }),
});
