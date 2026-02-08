import { db } from '@/db/drizzle'
import { users } from '@/db/schema'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)


        if (evt.type === 'user.created') {
            const { id, email_addresses, first_name, last_name } = evt.data

            const existing = await db.query.users.findFirst({
                where: eq(users.clerkId, id)
            })

            if (existing) return new Response("OK")

            const email = email_addresses?.[0]?.email_address ?? null;

            const name = [first_name, last_name].filter(Boolean).join(" ");

            await db.insert(users).values({
                clerkId: id,
                email,
                name
            })
        }

        if (evt.type === "user.updated") {
            const { id, email_addresses, first_name, last_name } = evt.data
            const email = email_addresses?.[0]?.email_address ?? null;

            const name = [first_name, last_name].filter(Boolean).join(" ");


            await db.update(users).set({
                email,
                name,
                updatedAt: new Date()
            }).where(eq(users.clerkId, id))
        }

        if (evt.type === "user.deleted") {
            const { id } = evt.data;
            if (!id) return new Response("OK")
            await db.delete(users).where(eq(users.clerkId, id))
        }

        console.log(`Received webhook with ID ${evt.data.id} and event type of ${evt.type}`)
        console.log('Webhook payload:', evt.data)

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}