import { FREE_RESPONSE_LIMIT } from './planLimits.js';

const EXPORT_PAGE_SIZE = 200;

export async function loadResponsesForExport(prisma, surveyId, { isOwnerPro = false } = {}) {
    const maxRows = isOwnerPro ? null : FREE_RESPONSE_LIMIT;
    const results = [];
    let cursorId = null;

    while (true) {
        const remaining = maxRows == null ? EXPORT_PAGE_SIZE : maxRows - results.length;
        if (remaining <= 0) break;
        const take = Math.min(EXPORT_PAGE_SIZE, remaining);
        const batch = await prisma.userSurveyResponse.findMany({
            where: { surveyId },
            include: {
                survey: {
                    select: {
                        surveyTitle: true,
                        surveyForms: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
            take,
            ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
        });
        if (!batch.length) break;
        results.push(...batch);
        cursorId = batch[batch.length - 1].id;
        if (batch.length < take) break;
    }

    return results;
}

export async function writeWorkbookToResponse(res, workbook, filename) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
}
